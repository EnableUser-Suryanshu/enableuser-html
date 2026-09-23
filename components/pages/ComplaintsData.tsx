import type { ComplaintsReport } from '@/lib/complaints';

/**
 * The investor-complaints tables on both Investor Charters.
 *
 * Rendered from Sanity so compliance can republish the figures monthly without
 * a deployment. Markup and classes match what PolicyBody produces for a table,
 * so these sit in the document without looking bolted on — including the
 * card-per-row treatment the wide ones get on a phone, which is what
 * data-label drives.
 */

const GRID = 'policy-table policy-table--grid';

function Trend({
  rows, first, caption,
}: { rows: ComplaintsReport['monthlyTrend']; first: string; caption: string }) {
  if (!rows.length) return null;
  const heads = [first, 'Carried forward', 'Received', 'Resolved', 'Pending'];
  return (
    <div className="policy-table-wrap">
      <table className={`${GRID} is-wide`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Sr. No.</th>
            {heads.map((h) => <th scope="col" key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            // "Grand Total" carries no serial number and is styled as a total.
            const total = /total/i.test(r.label);
            return (
              <tr key={r.label} className={total ? 'is-total' : undefined}>
                <td className="is-num" data-label="Sr. No.">{total ? '' : i + 1}</td>
                <td data-label={first}>{r.label}</td>
                <td className="is-num" data-label="Carried forward">{r.carriedForward}</td>
                <td className="is-num" data-label="Received">{r.received}</td>
                <td className="is-num" data-label="Resolved">{r.resolved}</td>
                <td className="is-num" data-label="Pending">{r.pending}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ComplaintsData({ report }: { report: ComplaintsReport }) {
  const snapHeads = [
    'Received from', 'Carried forward from previous month', 'Received during the month',
    'Total pending', 'Resolved', 'Pending — less than 3 months',
    'Pending — more than 3 months', 'Average resolution time (days)',
  ];

  return (
    <>
      <h3 className="policy-h policy-h3">Investor Complaints Data</h3>
      <h4 className="policy-h policy-h4">
        Data for every month ending {report.monthEnding}
      </h4>

      <div className="policy-table-wrap">
        <table className={`${GRID} is-wide`}>
          <caption className="sr-only">
            Investor complaints for the month, by where the complaint came from.
          </caption>
          <thead>
            <tr>
              <th scope="col">SN</th>
              {snapHeads.map((h) => <th scope="col" key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {report.snapshot.map((r, i) => {
              const total = /total/i.test(r.source);
              return (
                <tr key={r.source} className={total ? 'is-total' : undefined}>
                  <td className="is-num" data-label="SN">{total ? '' : i + 1}</td>
                  <td data-label="Received from">{r.source}</td>
                  <td className="is-num" data-label="Carried forward">{r.carriedForward}</td>
                  <td className="is-num" data-label="Received">{r.received}</td>
                  <td className="is-num" data-label="Total pending">{r.totalPending}</td>
                  <td className="is-num" data-label="Resolved">{r.resolved}</td>
                  <td className="is-num" data-label="Pending &lt; 3 months">{r.pendingUnder3}</td>
                  <td className="is-num" data-label="Pending &gt; 3 months">{r.pendingOver3}</td>
                  <td className="is-num" data-label="Avg. resolution (days)">{r.avgResolutionDays}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h4 className="policy-h policy-h4">Trend of monthly disposal of complaints</h4>
      <Trend rows={report.monthlyTrend} first="Month" caption="Complaints received and resolved, by month." />

      <h4 className="policy-h policy-h4">Trend of annual disposal of complaints</h4>
      <Trend rows={report.annualTrend} first="Year" caption="Complaints received and resolved, by financial year." />

      {report.updatedAt && (
        <p className="policy-note">Figures last updated {report.updatedAt}.</p>
      )}
    </>
  );
}
