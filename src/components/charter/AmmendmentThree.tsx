import Article from './Article';
import Paragraph from './Paragraph';
import Section from './Section';

export default function AmmendmentThree() {
  return (
    <Article number="III" title="Private Gatherings" ammendment>
      <Section number="A3.1" title="Allowance for private gatherings">
        <Paragraph>
          Qualifying cowboy photos may be taken at private gatherings, provided that at least one
          person present does not know about the cowboy competition prior to the event.
        </Paragraph>
      </Section>
      <Section number="A3.2" title="Definition of a private gathering">
        <Paragraph>
          A <span className="font-bold">private gathering</span> refers to any event or occasion
          where the general public is not invited or permitted to attend.
        </Paragraph>
      </Section>
    </Article>
  );
}
