import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables from .env.local or .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to database.");

    const adminEmail = "admin@foreverhealthcare.com";
    const adminPassword = "masterpassword123";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
        if(existingAdmin.role !== "admin") {
            existingAdmin.role = "admin";
            await existingAdmin.save();
            console.log(`Updated existing user ${adminEmail} to admin role.`);
        }
      console.log("Admin user already exists:", adminEmail);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "active",
      });

      await newAdmin.save();
      console.log(`Successfully created admin user.\nEmail: ${adminEmail}\nPassword: ${adminPassword}`);
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
