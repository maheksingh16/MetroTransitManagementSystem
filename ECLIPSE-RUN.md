# Run the website from Eclipse

## One-time setup in Eclipse

1. **File → Open Projects from File System**  
   Select folder:  
   `C:\Users\Udaypatap singh\Downloads\ipsemfive\metrobookingsystem\metrobookingsystem`

2. Wait for Maven to finish downloading.

3. Open:  
   `src/main/java/com/example/metrobookingsystem/MetrobookingsystemApplication.java`

4. Right-click that file → **Run As → Spring Boot App**  
   (If you only see “Java Application”, use that on `MetrobookingsystemApplication` — it still starts the web server.)

5. Wait until the Console shows:  
   `Tomcat started on port 8080`

6. Open your browser:  
   **http://localhost:8080**

That is the full website (login, journey planner, bookings, tickets).

---

## If the page is blank or old

Rebuild the frontend and copy it into Spring static files:

```bat
cd frontend
npm run build
cd ..
xcopy /E /Y frontend\dist\* src\main\resources\static\
```

Then Run the Spring Boot app again in Eclipse.

---

## Notes

- Website + API both run on **port 8080**
- PostgreSQL must be running (`metro_booking` database)
- Login: register a passenger, or use `admin@metro.com` / `admin123`
