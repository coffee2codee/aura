import image1 from "../images/image1.png";
import image2 from "../images/image2.png";
import image3 from "../images/image3.png";
import image4 from "../images/image4.png";

const base = {
  status: "available",
  amenities: [
    "Private lift",
    "Concierge",
    "Rooftop terrace",
    "Wellness spa",
    "Smart home",
    "Secure parking"
  ]
};

export const PROPERTIES = [
  {
    id: "the-meridian",
    title: "The Meridian Penthouse",
    location: "Worli Sea Face",
    city: "Mumbai",
    price: 185000000,
    propertyType: "Penthouse",
    bedrooms: 4,
    area: 6200,
    featured: true,
    description:
      "A sky-level residence of stone, oak and uninterrupted sea horizon, designed around a single, sweeping terrace.",
    images: [image1],
    video: null,
    ...base
  },

  {
    id: "oak-court",
    title: "Oak Court Residence",
    location: "Lutyens' Zone",
    city: "New Delhi",
    price: 96000000,
    propertyType: "Villa",
    bedrooms: 5,
    area: 8400,
    featured: true,
    description:
      "A courtyard villa wrapped in shaded colonnades and mature oaks, quiet at the heart of the capital.",
    images: [image2],
    video: null,
    ...base
  },

  {
    id: "verde-house",
    title: "Verde House",
    location: "Whitefield Hills",
    city: "Bengaluru",
    price: 54000000,
    propertyType: "Villa",
    bedrooms: 4,
    area: 5100,
    featured: true,
    description:
      "Terraced living stepping into a private forest garden, built in raw concrete and warm timber.",
    images: [image3],
    video: null,
    ...base
  },

  {
    id: "harbour-lofts",
    title: "Harbour Lofts",
    location: "Bandra Reclamation",
    city: "Mumbai",
    price: 42000000,
    propertyType: "Apartment",
    bedrooms: 3,
    area: 2800,
    featured: false,
    description:
      "Double-height lofts with industrial-grade glazing and a view of the bay.",
    images: [image4],
    video: null,
    ...base,
    status: "coming-soon"
  }
];