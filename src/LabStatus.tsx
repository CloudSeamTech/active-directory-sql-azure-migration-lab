import { Check, Circle, Cpu, Target } from 'lucide-react';
import { RetroWindow } from './RetroDesktop';

const objectives = ['Choose a network mode', 'Prepare a safe lab subnet', 'Configure the private network', 'Verify local connectivity', 'Understand recovery steps', 'Capture challenge evidence'];

export function LabStatus({ checks, complete, storageError }: { checks: number[]; complete: boolean; storageError: boolean }) {
  return <>
    <RetroWindow id="objectives" className="lab-panel objectives-panel">
      <h2><Target size={20}/> Lab objectives</h2>
      <p className="panel-caption">Your saved lesson checkpoints</p>
      <ul>{objectives.map((objective, i) => <li key={objective} className={checks.includes(i) ? 'achieved' : ''}><a href={`#section-${i}`}>{checks.includes(i) ? <Check size={17}/> : <Circle size={17}/>}<span>{objective}</span></a></li>)}</ul>
    </RetroWindow>
    <RetroWindow id="environment" className="lab-panel environment-panel">
      <h2><Cpu size={20}/> Environment status</h2>
      <dl><div><dt>Lesson</dt><dd className={complete ? 'saved-state' : ''}>{complete ? 'Completed' : checks.length ? 'In progress' : 'Not started'}</dd></div><div><dt>Checkpoints</dt><dd>{checks.length} / 6 checked</dd></div><div><dt>Progress storage</dt><dd className={storageError ? 'critical-state' : ''}>{storageError ? 'Session only' : 'This browser'}</dd></div><div><dt>VM telemetry</dt><dd>Not connected</dd></div></dl>
      <p className="panel-caption">Self-reported learning progress. This classroom does not monitor your VMs or verify server health.</p>
    </RetroWindow>
  </>;
}
