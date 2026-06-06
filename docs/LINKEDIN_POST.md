# LinkedIn Launch Post

Here is the finalized launch post copy for ChargerOS 🔥, refined to be highly conversational, free of dashes, and sound fully human.

## Recommended Image Order

1. `media/screenshots/10-multitasking.png` - **Hero Image**: showcases multiple apps (Terminal, System Monitor, Weather, Paint) open at once, demonstrating window manager, app launching, and shell design.
2. `media/screenshots/01-login.png` - Login screen first impression.
3. `media/screenshots/03-app-launcher.png` - Launcher highlighting the 59-app suite.
4. `media/screenshots/05-system-monitor.png` - System Monitor showing simulated CPU, memory, and processes.
5. `media/screenshots/08-games-chess.png` - Fully playable Chess game window.

---

## Post Copy

I built ChargerOS 🔥, a full desktop operating system simulation running entirely in the browser. 🖥️

Most browser OS projects are just iframes in a trench coat. I wanted to build something different.

What I ended up with is a complete desktop shell with a custom login page, window manager, app launcher, and a suite of 59 native apps. There are no iframes or external site embeds. Every app shares a virtual filesystem persisted in localStorage. For example, if you run `touch diary.txt` in the terminal, it instantly appears in the File Manager, can be opened in the Text Editor, and read back using the `cat` command.

The window manager coordinates Z-index stacking, minimize or maximize actions, and window boundary math. The app suite spans everything from an IDE with syntax highlighting and a Git client to fully playable games like Chess, Tetris, and Minesweeper.

The biggest thing I learned is that once you build a desktop environment, every detail becomes a systems design problem. Window focus, filesystem sync, and layout coordinate math all have to work together or nothing works at all.

Stack: React 19, TypeScript 5.9, Vite 7, Tailwind CSS, Lucide React, localStorage.

Code: https://github.com/Flamechargerr/ChargerOS

What feature would you build into a browser OS next? 👇

#React #TypeScript #OpenSource #WebDevelopment #SystemDesign

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
