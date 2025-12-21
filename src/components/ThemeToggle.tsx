'use client';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  const items = [
    {
      text: 'Light',
      onClick: () => setTheme('light')
    },
    {
      text: 'Dark',
      onClick: () => setTheme('dark')
    },
    {
      text: 'System',
      onClick: () => setTheme('system')
    }
  ]

  return <Menu as="div" className="relative inline-block">
    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-foreground shadow-xs inset-ring-1 inset-ring-gray-300 w-[24px] h-[24px]">
      <SunIcon width={24} height={24} className="transform hover:rotate-90 transition duration-300 dark:invisible absolute top-0 left-0" />
      <MoonIcon width={24} height={24} className="transform hover:rotate-45 hover:scale-125 transition duration-300 invisible dark:visible absolute top-0 left-0 hover:fill-yellow-300 hover:stroke-yellow-300" />
    </MenuButton>

    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 min-w-32 origin-top-right rounded-md bg-control shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {items.map(({ text, onClick }, index) => (
            <MenuItem key={`toggle-theme-${text}-${index}`}>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-foreground hover:text-neutral-900 dark:hover:text-neutral-100"
                onClick={onClick}
              >
                {text}
              </a>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Transition>
  </Menu>;
}
