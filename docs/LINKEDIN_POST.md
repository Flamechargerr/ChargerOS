# LinkedIn Launch Post

Here is the finalized launch post copy for ChargerOS 🔥, written with a personal, human-centric tone and highlighting the technical differentiators.

## Recommended Image Order

1. `media/screenshots/10-multitasking.png` - **Hero Image**: showcases multiple apps (Terminal, System Monitor, Weather, Paint) open at once, demonstrating window manager, app launching, and shell design.
2. `media/screenshots/01-login.png` - Login screen first impression.
3. `media/screenshots/03-app-launcher.png` - Launcher highlighting the 59-app suite.
4. `media/screenshots/05-system-monitor.png` - System Monitor showing simulated CPU, memory, and processes.
5. `media/screenshots/08-games-chess.png` - Fully playable Chess game window.

---

## Post Copy

I built **ChargerOS 🔥**, a browser desktop operating system simulation that runs entirely in the browser.

This started as a fun experiment, but I wanted to push it into something portfolio-worthy: a full desktop shell with login, wallpaper, taskbar, app launcher, draggable windows, local persistence, a virtual filesystem, terminal commands, and a 59-app suite.

There are many browser-based OS clones on GitHub, but I wanted ChargerOS to be different. Instead of just static layouts containing generic iframe embeds of other sites, I built everything natively:

- **A virtual filesystem persisted in localStorage**: All apps share the same filesystem state. If you run `touch diary.txt` in the terminal, it instantly shows up in the File Manager app, can be double-clicked to open in the Text Editor, modified, saved, and read back in the terminal using `cat`.
- **59 fully native React apps**: No iframes here! I built a complete suite—from productivity tools (Spreadsheet, Writer) and development utilities (syntax-highlighting IDE, Git client, Database manager, API Tester) to fully playable games like Chess, Tetris, and Minesweeper.
- **Draggable & resizable window manager**: Supports stacking Z-index focus, minimize/maximize/restore, and coordinate boundary limits.

Tech stack:
React 19, TypeScript 5.9, Vite 7, Tailwind CSS, Radix/shadcn-style UI primitives, Lucide React icons, and browser localStorage.

The biggest thing I learned: once you build a desktop environment, every single detail becomes a system design problem. Window focus, filesystem sync, and coordinate math all have to work together seamlessly.

Excited to keep improving ChargerOS with app lazy loading, safer formula parsing, and test coverage.

Check out the code here: https://github.com/Flamechargerr/ChargerOS

Would love feedback from frontend engineers and open-source folks. What app or feature should I build next?

#ReactJS #TypeScript #TailwindCSS #Vite #SystemDesign #OpenSource #WebDevelopment #Frontend #PortfolioProject

---

## Carousel Captions (Alternative Carousel PDF Post)

- **Slide 1:** ChargerOS 🔥 - browser desktop environment. Built with React 19 & TypeScript.
- **Slide 2:** Login Screen: Fully customized login panel supporting guest access.
- **Slide 3:** Desktop Shell: Features indicators, customizable wallpaper, taskbar, and desktop context menus.
- **Slide 4:** 59-App Suite: Desktop-grade apps from Development IDE to Chess and Media Players.
- **Slide 5:** Terminal & Virtual VFS: Runs `neofetch`, `ls`, `cd`, `tree` using a localStorage-persisted virtual filesystem.
- **Slide 6:** Multitasking: Dynamic draggable window manager with focus handling.

## Alt Text

- Alt Text - Multitasking: "A browser window showing the ChargerOS desktop with multiple overlapping windows open: Terminal running neofetch, Paint showing a drawing, System Monitor displaying charts, and Weather app showing local forecast."
- Alt Text - Login: "ChargerOS login screen with purple/orange abstract wallpaper, username and password fields, unlock button, and guest login."
- Alt Text - Launcher: "ChargerOS application launcher showing categories (Favorites, System, office, Games) and app icons."
- Alt Text - System Monitor: "ChargerOS System Monitor window displaying CPU history graph, memory usage percentage bar, and simulated running system processes table."
- Alt Text - Chess: "ChargerOS Chess game app window showing a standard checkerboard layout with 3D-styled chess pieces."
