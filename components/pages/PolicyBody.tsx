import type { PolicyBlock } from '@/lib/policies';
import { EXT } from '@/lib/links';

/**
 * Turns the links in a policy's text into real links.
 *
 * These documents are migrated regulatory text and carry two kinds: a bare
 * URL or email sitting in a sentence, and a labelled one the generator writes
 * as [label](href) because the published page had an anchor with its own
 * wording. Both are matched here so neither ends up as dead text a reader has
 * to retype — the depository charter alone has fourteen of them, half of them
 * the route to lodging a complaint.
 */
const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|(https?:\/\/[^\s<>"')\]]+)|([\w.+-]+@[\w-]+\.[\w.]+)/g;

function RichText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [full, label, labelled, bare, email] = m;
    if (email) {
      out.push(<a key={at} href={`mailto:${email}`}>{email}</a>);
    } else {
      const href = labelled ?? bare!;
      // Trailing punctuation belongs to the sentence, not the URL.
      const trimmed = bare ? href.replace(/[.,;:]+$/, '') : href;
      const tail = bare ? href.slice(trimmed.length) : '';
      out.push(
        <a key={at} href={trimmed} {...(trimmed.startsWith('http') ? EXT : {})}>
          {label ?? trimmed}
        </a>,
      );
      if (tail) out.push(tail);
    }
    last = at + full.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Counts, "Nil", "NA" and the like — centred and given tabular figures. */
const NUMERIC = /^(?:[\d.,%+/-]+|nil|na|n\.a\.|—|-)?$/i;

type TableRows = Extract<PolicyBlock, { t: 'table' }>['rows'];

/**
 * A table of short values (complaint counts, member IDs) rather than one of
 * running regulatory prose. These get fixed column widths so they always fit the
 * content column, and collapse into one card per row on narrow screens.
 */
const isDataGrid = (rows: TableRows) =>
  rows.length > 1 && rows.slice(1).every((row) => row.every((c) => c.text.length <= 26));

/**
 * Renders a migrated policy document. Consecutive `li` blocks are gathered into
 * a single list; everything else maps straight onto a heading, paragraph or table.
 */
export default function PolicyBody({ blocks }: { blocks: PolicyBlock[] }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = () => {
    if (!list.length) return;
    out.push(
      <ul className="policy-list" key={`ul-${out.length}`}>
        {list.map((text, i) => <li key={i}><RichText text={text} /></li>)}
      </ul>,
    );
    list = [];
  };

  blocks.forEach((b, i) => {
    if (b.t === 'li') { list.push(b.text); return; }
    flush();

    if (b.t === 'p') {
      out.push(<p key={i}><RichText text={b.text} /></p>);
    } else if (b.t === 'h') {
      const Tag = (b.level === 2 ? 'h2' : b.level === 3 ? 'h3' : 'h4') as 'h2' | 'h3' | 'h4';
      out.push(<Tag key={i} className={`policy-h policy-h${b.level}`}>{b.text}</Tag>);
    } else {
      // first row is treated as the header when it is marked up as one
      const [first, ...rest] = b.rows;
      const headed = first?.some((c) => c.head);
      const body = headed ? rest : b.rows;
      const grid = headed && isDataGrid(b.rows);
      // enough columns that they need fixed widths on desktop and one card per
      // row on mobile; a two- or three-column grid is fine as an ordinary table
      const wide = grid && first.length >= 5;
      // carried onto every body cell so the card layout can label its values
      const labels = headed ? first.map((c) => c.text) : [];
      const cls = ['policy-table', grid && 'policy-table--grid', wide && 'is-wide']
        .filter(Boolean).join(' ');

      out.push(
        <div className="policy-table-wrap" key={i}>
          <table className={cls}>
            {headed && (
              <thead>
                <tr>{first.map((c, j) => <th key={j} scope="col"><RichText text={c.text} /></th>)}</tr>
              </thead>
            )}
            <tbody>
              {body.map((row, r) => {
                // the closing row of these SEBI returns is always a total
                const total = grid && r === body.length - 1 && /total/i.test(row[1]?.text ?? '');
                return (
                  <tr key={r} className={total ? 'is-total' : undefined}>
                    {row.map((c, j) => {
                      const props = {
                        'data-label': labels[j],
                        className: grid && NUMERIC.test(c.text) ? 'is-num' : undefined,
                      };
                      const content = <RichText text={c.text} />;
                      return c.head
                        ? <th key={j} scope="row" {...props}>{content}</th>
                        : <td key={j} {...props}>{content}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>,
      );
    }
  });

  flush();
  return <>{out}</>;
}
