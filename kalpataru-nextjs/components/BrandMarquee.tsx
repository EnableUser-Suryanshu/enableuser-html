/**
 * Static trust strip. Previously a scrolling marquee — the client asked for a
 * fixed line with no movement, so there is deliberately no animation here.
 */
export default function BrandMarquee() {
  return (
    <div className="trust-strip">
      <div className="container">
        <p>
          Serving with <span>Trust</span> and <span>Transparency</span> since 1992
        </p>
      </div>
    </div>
  );
}
