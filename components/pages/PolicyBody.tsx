import type { PolicyBlock } from '@/lib/policies';

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
        {list.map((text, i) => <li key={i}>{text}</li>)}
      </ul>,
    );
    list = [];
  };

  blocks.forEach((b, i) => {
    if (b.t === 'li') { list.push(b.text); return; }
    flush();

    if (b.t === 'p') {
      out.push(<p key={i}>{b.text}</p>);
    } else if (b.t === 'h') {
      const Tag = (b.level === 2 ? 'h2' : b.level === 3 ? 'h3' : 'h4') as 'h2' | 'h3' | 'h4';
      out.push(<Tag key={i} className={`policy-h policy-h${b.level}`}>{b.text}</Tag>);
    } else {
      // first row is treated as the header when it is marked up as one
      const [first, ...rest] = b.rows;
      const headed = first?.some((c) => c.head);
      out.push(
        <div className="policy-table-wrap" key={i}>
          <table className="policy-table">
            {headed && (
              <thead>
                <tr>{first.map((c, j) => <th key={j} scope="col">{c.text}</th>)}</tr>
              </thead>
            )}
            <tbody>
              {(headed ? rest : b.rows).map((row, r) => (
                <tr key={r}>
                  {row.map((c, j) =>
                    c.head
                      ? <th key={j} scope="row">{c.text}</th>
                      : <td key={j}>{c.text}</td>,
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    }
  });

  flush();
  return <>{out}</>;
}
