import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Attendee } from './attendee-list';

interface DropdownProps {
  attendee: Attendee
  onUpdateList: () => void;
}

export function Dropdown({ attendee, onUpdateList }: DropdownProps) {

  function handleCheckIn() {
    const url = new URL(`http://localhost:3333/attendees/${attendee.id}/check-in`);

    fetch(url)
      .then(response => response.json)
      .then(() => {
        onUpdateList();
      })
  }

  function handleDelete() {
    const url = new URL(`http://localhost:3333/attendees/${attendee.id}`);

    fetch(url, {
      method: 'DELETE',
    })
      .then(() => onUpdateList())
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="bg-black/20 border border-white/10 rounded-md p-1.5 shadow-black outline-none hover:bg-black/10 focus:shadow-[0_0_0_2px] focus:shadow-black"

        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-black/90 rounded-md p-[5px] mr-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="group text-[13px] leading-none text-violet-400 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none hover:bg-violet-500 hover:text-white"
            onClick={handleCheckIn}
          >
            Fazer check-in
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="group text-[13px] leading-none text-violet-400 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none hover:bg-violet-500 hover:text-white"
            onClick={handleDelete}
          >
            Excluir
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-black" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}