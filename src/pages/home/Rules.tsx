import { useSession } from '@cjsantee/pondero-client';
import HatIcon from '../../components/HatIcon';
import useCharter from '../../hooks/queries/useCharter';
import Button from '../../components/Button';
import useAssentCharter from '../../hooks/mutations/useAssentCharter';

export default function Rules() {
  const { user } = useSession();
  const { data: cowboyAssents, isLoading } = useCharter();

  const assentCharter = useAssentCharter();

  if (isLoading || !cowboyAssents) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-3 mt-2 overflow-y-scroll">
      <h1 className="text-xl">The Cowboy Competition Charter</h1>
      <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <p className="text-sm italic">
          Adopted by the Five Cowboys on this day of friendly yet ruthless rivalry, February 22,
          2025
        </p>
        <Article number="I" title="Duration of the Competition">
          <Section number="1.1" title="Commencement and Termination">
            <Paragraph>
              The competition shall commence on{' '}
              <span className="font-bold">
                January 12, 2025, at 6:06 PM Central Time (Nashville, TN time zone).
              </span>
            </Paragraph>
          </Section>
          <Section number="1.2" title="Final Determination of Outcome">
            <Paragraph>
              The cowboy with the fewest accumulated points as of the official end time shall be
              declared the <span className="font-bold">Loser</span> of the competition.
            </Paragraph>
          </Section>
        </Article>
        <Article number="II" title="Submissions and Eligibility">
          <Section number="2.1" title="Valid Submission Requirements">
            <Paragraph>
              Points may only be earned through photographs that meet the following criteria:
              <ol className="list-disc pl-5">
                <li>
                  The photograph must be submitted either directly to the designated group chat or
                  uploaded via cowboycounter.com.
                </li>
                <li>
                  The photograph must be taken in a <span className="font-bold">public place</span>{' '}
                  (see Article VI, Section 6.1).
                </li>
              </ol>
            </Paragraph>
          </Section>
          <Section number="2.2" title="Submission Frequency">
            <Paragraph>
              Each cowboy may submit a maximum of{' '}
              <span className="font-bold">one qualifying photograph per calendar day</span>,
              regardless of the number of locations or events at which a cowboy wears their hat.
            </Paragraph>
          </Section>
          <Section number="2.3" title="Midnight Clause">
            <Paragraph>
              For the purposes of submission frequency, an "
              <span className="font-bold">outing</span>" is defined as a continuous period of
              hat-wearing activity in public, uninterrupted by a return home or a prolonged break
              (e.g., sleep or significant downtime).
            </Paragraph>
            <Paragraph>
              If an outing spans across <span className="font-bold">midnight</span>, it shall still
              be considered a <span className="font-bold">single outing</span>, and any photographs
              taken during that outing—regardless of calendar date—shall count as{' '}
              <span className="font-bold">one single submission opportunity</span>.
            </Paragraph>
            <Paragraph>
              Submitting photos from both before and after midnight during the same outing is{' '}
              <span className="font-bold">not permitted</span> for the purpose of earning multiple
              days’ worth of points. Only <span className="font-bold">one photograph</span> from
              such an outing may be submitted for scoring.
            </Paragraph>
          </Section>
          <Section number="2.4" title="Documentation Submissions">
            <Paragraph>
              Additional photographs may be submitted to the group chat or uploaded to
              cowboycounter.com for documentation, storytelling, or entertainment purposes. However,
              only <span className="font-bold">one photograph per calendar day</span> may be counted
              toward point accumulation. All other photos shall be considered{' '}
              <span className="font-bold">non-scoring</span> and serve only as supplemental records.
            </Paragraph>
          </Section>
        </Article>
        <Article number="III" title="Points Allocation">
          <Section number="3.1" title="Standard Scoring">
            <Paragraph>
              Each valid, qualifying photograph submitted in accordance with Article II shall earn
              the submitting cowboy <span>1 point</span>.
            </Paragraph>
          </Section>
          <Section number="3.2" title="Enhanced Scoring for Special Circumstances">
            <Paragraph>
              Photographs taken while the cowboy is{' '}
              <span className="font-bold">mounted upon a horse</span> (see Article VI, Section 6.2)
              shall earn a total of <span className="font-bold">3 points</span>, provided all other
              submission requirements are met. Additional bonus point conditions may be introduced
              only by unanimous consent, as outlined in Article VII.
            </Paragraph>
          </Section>
        </Article>
        <Article
          number="IV"
          title="Determination of the Loser and the Punishment
Thereof">
          <Section number="4.1" title="The Loser">
            <Paragraph>
              The cowboy with the <span className="font-bold">lowest total point count</span> as of
              the official end time (see Article I, Section 1.2) shall be declared the{' '}
              <span className="font-bold">Loser</span> of the competition.
            </Paragraph>
          </Section>
          <Section number="4.2" title="Punishment of the Loser">
            <Paragraph>
              The Loser shall be obligated to attend an outing with all five cowboys present,
              wearing an{' '}
              <span className="font-bold">
                outfit chosen collectively by the other four cowboys.
              </span>{' '}
              The selected outfit must comply with all local laws and public decency standards, but
              may otherwise be as outlandish, humiliating, or thematically appropriate as the four
              cowboys deem fit.
            </Paragraph>
          </Section>
        </Article>
        <Article number="V" title="Enforcement of Competitive Integrity">
          <Section number="5.1" title="Spirit of the Competition Clause">
            Should four of the five cowboys unanimously declare “
            <span className="font-bold">Shame</span>” upon the fifth cowboy for actions deemed to
            violate the spirit of the competition, the accused shall suffer a penalty of{' '}
            <span className="font-bold">–3 points</span>.
          </Section>
        </Article>
        <Article number="VI" title="Definitions">
          <Section number="6.1" title="Public Place">
            For the purposes of this Charter, a public place is defined as any location accessible
            to the general public and not affiliated with the cowboy’s personal residence or place
            of employment.
          </Section>
          <Section number="6.2" title="Mounted Upon a Horse">
            <Paragraph>
              A cowboy shall be considered mounted if their body is situated on the back of a living
              horse in a manner consistent with riding, regardless of motion.
            </Paragraph>
          </Section>
          <Section number="6.3" title="Outing">
            <Paragraph>
              An outing is defined as any event or public gathering in which the Loser’s presence is
              observable by at least one uninvolved party (i.e., a civilian).
            </Paragraph>
          </Section>
        </Article>
        <Article number="VII" title="Amendments">
          <Section number="7.1" title="Modifications to the Charter">
            <Paragraph>
              This Charter may be amended only with unanimous consent of all five cowboys, recorded
              and acknowledged in the group chat.
            </Paragraph>
          </Section>
        </Article>
        <Article number="I" title="“Live Like You Were Dying” Bonus Activities" ammendment>
          <Section number="A1.1" title="Eligible Activities and Scoring">
            <Paragraph>
              A cowboy shall earn <span className="font-bold">5 points</span> for submitting a
              qualifying photograph taken while participating in any of the following activities,
              inspired by the Tim McGraw song{' '}
              <span className="italic">Live Like You Were Dying</span>, provided the cowboy is
              wearing a cowboy hat and all general submission requirements (see Article II) are
              satisfied:
              <ol type="a" className="pl-5" style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  Riding a bull named Fu Manchu for{' '}
                  <span className="font-bold">more than 2.7 seconds.</span>
                  <ol className="list-disc pl-5">
                    <li>The bull may be mechanical or live.</li>
                    <li>The bull’s name does not require verification.</li>
                  </ol>
                </li>
                <li>
                  Skydiving.
                  <ol className="list-disc pl-5">
                    <li>
                      The qualifying photo may be taken{' '}
                      <span className="font-bold">prior to exiting the aircraft</span>, but must
                      show the cowboy wearing{' '}
                      <span className="font-bold">both their cowboy hat and a parachute</span>.
                    </li>
                  </ol>
                </li>
                <li>
                  Watching an eagle fly.
                  <ol className="list-disc pl-5">
                    <li>
                      The eagle must be <span className="font-bold">visibly airborne</span> in the
                      photograph.
                    </li>
                  </ol>
                </li>
                <li>
                  Loving deeper.
                  <ol className="list-disc pl-5">
                    <li>
                      The photograph must capture the{' '}
                      <span className="font-bold">act of proposing</span> (e.g., kneeling or ring
                      presentation) while wearing the cowboy hat.
                    </li>
                  </ol>
                </li>
                <li>
                  Climbing any of the <span className="font-bold">Rocky Mountains</span>.
                  <ol className="list-disc pl-5">
                    <li>
                      The photograph must be taken on a{' '}
                      <span className="font-bold">recognized peak</span> or slope within the{' '}
                      <span className="font-bold">Rocky Mountain Range</span>.
                    </li>
                  </ol>
                </li>
              </ol>
            </Paragraph>
          </Section>
          <Section number="A1.2" title="One-Time Completion Rule">
            <Paragraph>
              Each activity listed in Section A1.1 may be completed and scored only{' '}
              <span className="font-bold">once per cowboy</span> throughout the duration of the
              competition.
            </Paragraph>
          </Section>
          <Section number="A1.3" title="Clarification of Bonus Status">
            <Paragraph>
              Each qualifying photo under this Amendment shall earn{' '}
              <span className="font-bold">3 points</span>, superseding the standard 1-point value
              described in Article III, Section 3.1. Only one activity-based bonus may be applied
              per photo.
            </Paragraph>
          </Section>
        </Article>
        <Article number="II" title="Winner's Prize — The Cowboy Champion’s Belt" ammendment>
          <Section number="A2.1" title="Award of the Belt and Buckle">
            <Paragraph>
              The cowboy with the highest point total at the conclusion of the competition shall be
              declared the Winner and shall be awarded a{' '}
              <span className="font-bold">belt and belt buckle</span> commemorating their victory.
            </Paragraph>
          </Section>
          <Section number="A2.2" title="Funding and Cost Limit">
            <Paragraph>
              The combined cost of the belt and buckle shall not exceed{' '}
              <span className="font-bold">$100 USD</span>. The cost shall be{' '}
              <span className="font-bold">equally divided among the four non-winning cowboys</span>,
              each of whom shall contribute one-quarter of the total amount.
            </Paragraph>
          </Section>
          <Section number="A2.3" title="Design and Presentation">
            <Paragraph>
              The design of the belt and buckle may reflect cowboy aesthetics, the name of the
              competition, or the identity of the Winner, at the discretion of the contributing
              cowboys. The belt shall be <span className="font-bold">physically presented</span> to
              the Winner in the presence of all five cowboys during the{' '}
              <span className="font-bold">final outing</span> or an agreed-upon ceremonial occasion.
            </Paragraph>
          </Section>
        </Article>
        <div className="mt-4 mb-8">
          <h3>Agreed and accepted:</h3>
          {cowboyAssents?.cowboys?.length &&
            cowboyAssents.cowboys.map(({ cowboy_id, name }) => (
              <div
                key={cowboy_id}
                className="flex items-center mt-2"
                style={{ fontFamily: 'cursive' }}>
                <HatIcon cowboy_id={cowboy_id} />
                <span className="ml-1">{name}</span>
              </div>
            ))}
          {user && !cowboyAssents.cowboys.some(({ user_id }) => user_id === user.user_id) && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() =>
                  assentCharter.mutate({
                    cowboy_charter_version_id: cowboyAssents.cowboy_charter_version_id,
                  })
                }
                title="Sign Charter"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Article({
  number,
  title,
  children,
  ammendment = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  ammendment?: boolean;
}) {
  return (
    <article id={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-lg font-bold mt-2">
        {ammendment ? 'Amendment' : 'Article'} {number}: {title}
      </h2>
      {children}
    </article>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-md font-semibold mt-2">
        Section {number} — {title}
      </h3>
      {children}
    </section>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <div className="text-sm mt-1">{children}</div>;
}
