# Backend notes for the Fundoo Notes frontend

No backend change is **required** to run this frontend. The app is built strictly
against the endpoints that exist in `Dheeraj-999/FundooNotes` today. These are the
gaps found while integrating, with the frontend workaround and the suggested fix.

| Gap | Frontend workaround | Suggested backend change |
| --- | --- | --- |
| `GET /api/notes` returns active, archived and trashed notes; no filter, search, sort or pagination | Client-side filters on `archived` / `trashed` and client-side search | Add `GET /api/notes?archived=false&trashed=false&search=&labelId=&page=&size=` or dedicated endpoints |
| No note update endpoint | Edit action is not shown | `PUT /api/notes/{noteId}` accepting `title` and `description` |
| No permanent delete endpoint | Trash view offers restore only | `DELETE /api/notes/{noteId}` for hard delete |
| No password reset / forgot-password endpoint | Screens explain that the feature is unavailable | Add `POST /api/users/forgot-password` and `POST /api/users/reset-password`; keep OTP server-side instead of returning it in `/api/redis/otp/generate` |
| No color, collaborator or attachment resource | Not shown in the UI | Add fields/endpoints only if the product needs them; the current file endpoint is Excel import (`/api/batch/import/notes`) |
| CORS allows only `http://localhost:5173` | Dev proxy avoids CORS; deployments must match | Make allowed origins configurable via an environment property so the same API can serve staging/production |
| Missing `Authorization` header currently falls through to the generic 500 handler | Frontend always sends the header | Handle `MissingRequestHeaderException` explicitly and return 401 with the standard error DTO |
| `ObjectMapperConfig` declares a plain `new ObjectMapper()` | Frontend sends only documented fields and local ISO datetime strings | Use Spring's configured `ObjectMapper` (register Java Time module, disable `FAIL_ON_UNKNOWN_PROPERTIES`) to make JSON handling predictable |
| No refresh token; JWT expires in 24 hours | Frontend clears the token on expired-session errors and asks the user to log in again | Add a refresh endpoint or shorter-lived tokens with refresh cookies |
| Backend test properties were locally switched from H2 to MySQL | Not a frontend issue | Keep H2 for `@SpringBootTest` tests so `mvn test` runs without external services; restore `src/test/resources/application.properties` |
| Datasource credentials and JWT secret are committed in properties | Not a frontend issue | Move them to environment variables / secrets |

## Running the backend with the frontend

The backend works with the current setup when these are available locally:

- MySQL database `fundoo_notes` on port 3306
- ActiveMQ on port 61616 (registration events)
- RabbitMQ on port 5672 (reminder events)
- Redis on port 6379 (OTP/save endpoints)

The frontend itself only needs the HTTP API on port 8080; the background services
affect event processing, not page rendering.
