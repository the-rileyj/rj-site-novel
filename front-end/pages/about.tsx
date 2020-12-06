import Layout from "../components/Layout";
import GlitchText from "../components/GlitchText";

const AboutPage = () => (
  <Layout title="About | RJ's Site">
    <div style={{ fontSize: "28px" }}>
      <GlitchText text="About" />
    </div>
    <p>A proud American.</p>
    <p>
      My life is almost entirely on rails. It is truly an underrated lifestyle.
    </p>
    <p>
      Time is split equally (though admittedly some days are less equal than
      others) between programming, listening to esoteric music, working out, and
      spending time with the people I love.
    </p>
    <p>
      I believe that though life is finite, that isn't an excuse to indulge in
      corrosive habits, but rather to grow yourself to fully take advantage of
      what little time we have.
    </p>
    <div style={{ fontSize: "28px" }}>
      <GlitchText text="About You" />
    </div>
    <p>
      As you sit here and read this, I want to think about what your purpose in
      life is. Not in a metaphysical way, merely what makes your life worth
      living (by your own standards). If you can't find your purpose, I hope you
      find it. If you know your purpose, I hope you are living your live in a
      way which manifests that purpose.
    </p>
    <p>Stay strong in these trying times. May God be with you.</p>
  </Layout>
);

export default AboutPage;
