# LinkedIn Launch Post

Here is the optimized launch post copy for ChargerOS, structured to maximize engagement on LinkedIn and showcase the technical complexity of your project.

## Recommended Image Order

1. `media/screenshots/10-multitasking.png` - **Hero Image**: showcases multiple apps (Terminal, System Monitor, Weather, Paint) open at once, demonstrating window manager, app launching, and shell design.
2. `media/screenshots/01-login.png` - Login screen first impression.
3. `media/screenshots/03-app-launcher.png` - Launcher highlighting the 59-app suite.
4. `media/screenshots/05-system-monitor.png` - System Monitor showing simulated CPU, memory, and processes.
5. `media/screenshots/08-games-chess.png` - Fully playable Chess game window.

---

## Post Copy

🚀 **I built ChargerOS: An Ubuntu-inspired Browser Desktop Simulation!** 🖥️✨

I’ve always been fascinated by operating systems and how they manage complex workflows, windows, and state. To challenge myself as a frontend engineer, I built **ChargerOS**—a fully interactive simulation of the Ubuntu desktop environment, running entirely in the browser.

What started as a simple experiment quickly grew into a robust system design project. Here is a breakdown of what I built:

🔹 **Draggable & Resizable Window Manager**: Custom Z-index stacking focus, active indicators, and drag-and-drop boundary management.
🔹 **Virtual Unix-style Filesystem**: Mocked directories like `/home`, `/etc`, `/usr`, and `/var` persisted through browser `localStorage`.
🔹 **Linux Terminal**: A fully functional command line simulation with 16+ native commands (like `ls`, `cd`, `pwd`, `neofetch`, `tree`, `cowsay`, and shell history).
🔹 **59-App Suite**: Across System, Development, Games, Media, Graphics, Office, Utilities, and Internet. Play Chess, write text documents, run calculations, draw in Paint, or mock API queries!
🔹 **Polished Desktop Shell**: Features a top panel with real-time indicators, customizable wallpaper settings, taskbar dock, and mouse context menus.

### 🛠️ The Tech Stack
* **Core**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS (fully customized theme), Radix/shadcn-style UI primitives, Lucide React icons
* **Data & Persistence**: Browser LocalStorage

### 🧠 Key Engineering Takeaways
Building a browser-based OS environment means every micro-interaction becomes a system design challenge:
1. **Window Focus & Z-Index Management**: Coordinating window focus order without memory leaks or unnecessary React re-renders.
2. **State Synchronization**: Dynamically syncing the virtual filesystem changes with the terminal output, the File Manager application, and browser storage.
3. **Responsive Geometry**: Resolving drag-and-drop coordinates and sizing calculations across different viewport sizes.

👇 **Check out the code and run it yourself**:
GitHub Repository: https://github.com/Flamechargerr/ChargerOS

I’d love to get feedback from fellow developers, Linux enthusiasts, and open-source advocates. What app or feature should I build next?

#ReactJS #TypeScript #TailwindCSS #Vite #WebDevelopment #SystemDesign #PortfolioProject #Linux #OpenSource #Ubuntu #Frontend

---

## Carousel Captions (Alternative Carousel PDF Post)

- **Slide 1:** ChargerOS - Ubuntu-inspired browser desktop environment. Built with React 19 & TypeScript.
- **Slide 2:** Login Screen: Fully customized Ubuntu login panel supporting guest access.
- **Slide 3:** Desktop Shell: Features indicators, customizable wallpaper, taskbar, and desktop context menus.
- **Slide 4:** 59-App Suite: Desktop-grade apps from Development IDE to Chess and Media Players.
- **Slide 5:** Terminal & Virtual VFS: Runs `neofetch`, `ls`, `cd`, `tree` using a localStorage-persisted virtual filesystem.
- **Slide 6:** Multitasking: Dynamic draggable window manager with focus handling.

## Alt Text

- Multitasking: "A browser window showing the ChargerOS desktop with multiple overlapping windows open: Terminal running neofetch, Paint showing a drawing, System Monitor displaying charts, and Weather app showing local forecast."
- Login: "ChargerOS login screen with purple/orange abstract wallpaper, username and password fields, unlock button, and guest login."
- Launcher: "ChargerOS application launcher showing categories (Favorites, System, office, Games) and app icons."
- System Monitor: "ChargerOS System Monitor window displaying CPU history graph, memory usage percentage bar, and simulated running system processes table."
- Chess: "ChargerOS Chess game app window showing a standard checkerboard layout with 3D-styled chess pieces."
