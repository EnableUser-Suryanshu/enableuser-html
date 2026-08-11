import { MAPS, EXT } from '@/lib/links';
import { Phone, IdCard, MapPin, Mail, Map, WhatsApp } from './icons';

export default function Help() {
  return (
    <section className="section help watch" id="help">
      <div className="container">
        <h2>Help Center &amp; Support</h2>
        <p className="sub">
          Get in touch with our expert teams for any assistance regarding trading,
          investments, or account support.
        </p>
        <div className="help-grid stagger">
          <div className="hcard">
            <div className="icon"><Phone strokeW={1.8} /></div>
            <h3>General Support</h3>
            <p className="note">Available during market hours</p>
            <a className="tel" href="tel:07554350141">0755-4350141, 4350142</a>
            <a className="tel" href="tel:07554350143">0755-4350143, 9425008895</a>
            <a className="mail" href="mailto:kmlho@kalpatarumulti.com">
              <Mail size={16} strokeW={1.8} />
              kmlho@kalpatarumulti.com
            </a>
          </div>
          <div className="hcard">
            <div className="icon"><IdCard strokeW={1.8} /></div>
            <h3>Mutual Funds Desk</h3>
            <p className="note">Dedicated support for MF &amp; SIPs</p>
            <a className="tel" href="tel:07554350141">0755-4350141</a>
            <a className="tel" href="tel:07554262655">0755-4262655</a>
            <div className="wa-row">
              <a href={MAPS.whatsapp} {...EXT} className="btn btn-wa">
                <WhatsApp /> 76489 83065
              </a>
              <a href={MAPS.whatsappAlt} {...EXT} className="btn btn-wa">
                <WhatsApp /> 95897 54231
              </a>
            </div>
          </div>
          <div className="hcard">
            <div className="icon"><MapPin strokeW={1.8} /></div>
            <h3>Corporate Office</h3>
            <address>
              Hall No. 2, 1st Floor Western Block, Above Central Bank, GTB Complex,
              T. T. Nagar, Bhopal - 462003
            </address>
            <a className="mail" href={MAPS.corporateBhopal} {...EXT}>
              <Map size={16} strokeW={1.8} />
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
