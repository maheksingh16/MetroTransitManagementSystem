package com.example.metrobookingsystem;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Opens http://localhost:8080 after startup.
 * Uses Windows rundll32/cmd because Eclipse often blocks java.awt.Desktop.
 */
@Component
public class BrowserLauncher {

    private static final Logger logger = LoggerFactory.getLogger(BrowserLauncher.class);
    private static final String URL = "http://localhost:8080";

    @EventListener(ApplicationReadyEvent.class)
    public void openBrowser() {
        // Small delay so Tomcat fully accepts connections
        new Thread(() -> {
            try {
                Thread.sleep(800);
                boolean opened = openOnWindows() || openWithDesktop() || openOnMacOrLinux();
                if (opened) {
                    logger.info("Website opened: {}", URL);
                } else {
                    logger.warn("AUTO-OPEN FAILED. Open this URL manually in Chrome/Edge: {}", URL);
                    System.out.println();
                    System.out.println("==================================================");
                    System.out.println("  OPEN WEBSITE:  " + URL);
                    System.out.println("==================================================");
                    System.out.println();
                }
            } catch (Exception e) {
                logger.warn("Could not open browser. Open manually: {}", URL);
                System.out.println("OPEN WEBSITE MANUALLY: " + URL);
            }
        }, "browser-launcher").start();
    }

    private boolean openOnWindows() {
        String os = System.getProperty("os.name", "").toLowerCase();
        if (!os.contains("win")) {
            return false;
        }
        try {
            // Most reliable from Eclipse on Windows
            new ProcessBuilder(
                    "rundll32",
                    "url.dll,FileProtocolHandler",
                    URL
            ).inheritIO().start();
            return true;
        } catch (Exception ignored) {
            // fall through
        }
        try {
            // start needs an empty window title as first quoted arg
            new ProcessBuilder("cmd", "/c", "start", "", URL).start();
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    private boolean openWithDesktop() {
        try {
            if (java.awt.Desktop.isDesktopSupported()
                    && java.awt.Desktop.getDesktop().isSupported(java.awt.Desktop.Action.BROWSE)) {
                java.awt.Desktop.getDesktop().browse(new java.net.URI(URL));
                return true;
            }
        } catch (Exception ignored) {
            // Eclipse often disables AWT Desktop
        }
        return false;
    }

    private boolean openOnMacOrLinux() {
        String os = System.getProperty("os.name", "").toLowerCase();
        try {
            if (os.contains("mac")) {
                new ProcessBuilder("open", URL).start();
                return true;
            }
            if (os.contains("nux") || os.contains("nix")) {
                new ProcessBuilder("xdg-open", URL).start();
                return true;
            }
        } catch (Exception ignored) {
            // ignore
        }
        return false;
    }
}
