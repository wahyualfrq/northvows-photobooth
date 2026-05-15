# 🎞️ NorthVows Photobooth • Seoul Session

> A nostalgic, dreamy-vintage digital photobooth experience. Capture your moments, craft your memoir, and preserve them in high-quality digital strips.

![NorthVows Cover](https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200)

## ✨ Core Features

- **Immersive Studio Experience**: A camera-first interface designed for immediate creative flow.
- **Dreamy Vintage Aesthetic**: Curated "Noir", "Vintage Blue", and "Dreamy" filters using real-time Canvas processing.
- **Dynamic Post-Processing**: Change filters, add Retro Grain, or toggle Date Stamps even *after* your photos are taken.
- **High-Quality Export**: Capture your photo strips in high-resolution (3x pixel density) ready for digital sharing or physical printing.
- **Scrapbook Atmosphere**: Premium animations and glassmorphism UI that feels alive and nostalgic.
- **Cross-Platform Ready**: Optimized for both Desktop and Mobile (Safari/Chrome/Edge).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Framer Motion
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: Canvas API & `html-to-image`
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/northvows-pb.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `src/app`: Next.js pages and routing logic.
- `src/components`: Reusable UI components (CameraView, FrameSelector, etc).
- `src/data`: Configuration for frames, layouts, and filters.
- `src/lib`: Utility functions and helper scripts.
- `public/images`: Aesthetic assets and decorative elements.

## 🎨 Creative Direction

NorthVows is inspired by the "Seoul Session" aesthetic—clean, denim-toned, and emotionally resonant. The UI utilizes a soft color palette of Cream White (`#F4EEE6`), Soft Navy (`#24344D`), and Vintage Blue (`#AFCDF5`) to create a calm yet professional creative environment.

## 📄 License

This project is licensed under the MIT License.

---
*Crafted with ❤️ by NorthVows Studio Team*
