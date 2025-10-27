import { aclHasPermission, useSession } from '@cjsantee/pondero-client';
import Article from './Article';
import Paragraph from './Paragraph';
import Section from './Section';

export default function AmmendmentThree() {
  const { user } = useSession();

  const isCowboy = aclHasPermission(user?.acl ?? 'invalid', 'cowboy');

  return (
    <Article number="III" title="Private Gatherings" ammendment>
      <Section number="A3.1" title="Allowance for private gatherings">
        <Paragraph>
          Qualifying cowboy photos may be taken at private gatherings, provided that the gathering
          would be considered closer to a party than a hang.
        </Paragraph>
      </Section>
      <Section number="A3.2" title="Definition of a private gathering">
        <Paragraph>
          A <span className="font-bold">private gathering</span> refers to any event or occasion
          where the general public is not invited or permitted to attend.
        </Paragraph>
        <Paragraph>
          A <span className="font-bold">party</span> is defined as any event at which playing board
          games would <span className="font-bold">decrease</span> and not increase the current vibes
          of the gathering.
        </Paragraph>
        {isCowboy && (
          <Paragraph>
            The distinction of vibes at such an event shall follow the “I know it when I see it”
            precedent set forth by the United States Supreme Court in Jacobellis v. Ohio.
          </Paragraph>
        )}
      </Section>
    </Article>
  );
}
