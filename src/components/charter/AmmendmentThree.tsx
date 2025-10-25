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
          Qualifying cowboy photos may be taken at private gatherings, provided that{' '}
          <span className="font-bold">at least one (1)</span> person present{' '}
          <span className="font-bold">does not</span> know about the cowboy competition prior to the
          event.
        </Paragraph>
      </Section>
      <Section number="A3.2" title="Definition of a private gathering">
        <Paragraph>
          A <span className="font-bold">private gathering</span> refers to any event or occasion
          where the general public is not invited or permitted to attend.
        </Paragraph>
        {isCowboy ? (
          <Paragraph>
            Following the standard definition of an orgy, a private gathering must involve{' '}
            <span className="font-bold">at least five (5)</span> participants.
          </Paragraph>
        ) : (
          <Paragraph>
            A private gathering must include at <span className="font-bold">least five (5)</span>{' '}
            participants.
          </Paragraph>
        )}
      </Section>
    </Article>
  );
}
