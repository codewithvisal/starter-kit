import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from './configs/passport';
import authRoutes from "./routes/auth.routes";
import propertyTypeRoutes from "./routes/property-type.routes";
import amenityRoutes from './routes/amenity.routes';
import propertyRoutes from './routes/property.routes';
import bookingRoutes from './routes/booking.routes';
import { errorHandler } from './utils/error';
import availabilityRoutes from "./routes/availability.routes";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// API v1 Routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/property-types', propertyTypeRoutes);
app.use('/api/v1/amenities', amenityRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/availabilities', availabilityRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;