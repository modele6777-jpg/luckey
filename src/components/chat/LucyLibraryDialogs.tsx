import { memo, type ButtonHTMLAttributes } from 'react';
import { DialogTriggerButton } from '@/components/layout/DialogTriggerButton';
import { useLibrarySessionState } from '@/hooks/useLibrarySessionState';
import { PromptLibraryModal } from './PromptLibraryModal';

/** Opening a library must never rerender the entire conversation. */
export function LucyLibraryTrigger({ stateKey, onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { stateKey: string }) {
  const [open, setOpen] = useLibrarySessionState<boolean>(`${stateKey}:open`, false);
  return <DialogTriggerButton {...props} aria-expanded={open} onClick={event => {
    setOpen(true);
    onClick?.(event);
  }} />;
}

export const LucyLibraryDialogs = memo(function LucyLibraryDialogs({ sessionKey, isLight, onSelectPrompt }: {
  sessionKey: string;
  isLight: boolean;
  onSelectPrompt: (text: string, sendImmediately: boolean, toolIds?: string[], title?: string) => void;
}) {
  const [promptOpen, setPromptOpen] = useLibrarySessionState<boolean>(`${sessionKey}:prompt:open`, false);
  return <>
    <PromptLibraryModal sessionKey={`${sessionKey}:prompt`} isOpen={promptOpen} onClose={() => setPromptOpen(false)} onSelectPrompt={onSelectPrompt} />
  </>;
});
