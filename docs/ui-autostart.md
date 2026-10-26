# UI autostart on macOS

The optional LaunchAgent starts the local UI server when you log in at
`http://127.0.0.1:4173/`. It does not open a browser window. Logs are written to
`~/Library/Logs/DeutschDrill/`.

Enable it by running this from the project directory:

```sh
python3 scripts/ui_autostart.py install
```

This installs the LaunchAgent for your macOS user and starts the server immediately.
If you already started the server manually, stop that instance before installing to
avoid a port conflict.

Disable autostart and remove the LaunchAgent with:

```sh
python3 scripts/ui_autostart.py uninstall
```
