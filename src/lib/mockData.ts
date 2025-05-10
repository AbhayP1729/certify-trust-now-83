
export const partnersData = [
  { id: 1, name: "Harvard University", logo: "https://images.unsplash.com/photo-1598222983241-a267a4d93f16?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 2, name: "MIT", logo: "https://images.unsplash.com/photo-1639815188546-c43c240e8335?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 3, name: "Stanford University", logo: "https://images.unsplash.com/photo-1599687266782-4bfc528dcd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 4, name: "Oxford University", logo: "https://images.unsplash.com/photo-1590058206071-26fd30c15d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 5, name: "Cambridge University", logo: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 6, name: "Yale University", logo: "https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 7, name: "Princeton University", logo: "https://images.unsplash.com/photo-1575517111839-3afbf11d8f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
  { id: 8, name: "Columbia University", logo: "https://images.unsplash.com/photo-1630636755810-0d1a9b366d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" },
];

export const statsData = {
  certificatesIssued: 58764,
  organizationsOnboarded: 127,
  verificationsPerformed: 283451
};

export const sampleCertificateValid = {
  id: "cert-abc-123-xyz-789",
  recipient: "Jane Doe",
  institution: "Harvard University",
  degree: "Bachelor of Science in Computer Science",
  graduationDate: "May 15, 2022",
  issueDate: "June 1, 2022",
  expiryDate: null,
  blockchainId: "0x1a2b3c4d5e6f7g8h9i0j",
  blockchainTimestamp: "2022-06-01T14:32:17Z",
  isValid: true,
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cert-abc-123-xyz-789"
};

export const sampleCertificateInvalid = {
  id: "cert-invalid-123",
  isValid: false,
  error: "Certificate hash does not match blockchain record."
};

export const agencyStats = {
  organizations: 127,
  certificates: 58764,
  verifications: 283451,
  qrCodes: 58764
};

export const recentActivity = [
  { id: 1, action: "Certificate Batch Uploaded", organization: "Harvard University", date: "2023-05-09", count: 234 },
  { id: 2, action: "New Organization Added", organization: "Princeton University", date: "2023-05-08", count: null },
  { id: 3, action: "QR Codes Generated", organization: "MIT", date: "2023-05-07", count: 189 },
  { id: 4, action: "Certificates Verified", organization: "Various", date: "2023-05-07", count: 1267 },
];

export const monthlyStats = [
  { month: "Jan", certificates: 4200, verifications: 19000 },
  { month: "Feb", certificates: 3800, verifications: 18500 },
  { month: "Mar", certificates: 5100, verifications: 22000 },
  { month: "Apr", certificates: 4700, verifications: 21500 },
  { month: "May", certificates: 5200, verifications: 24300 },
  { month: "Jun", certificates: 6100, verifications: 26800 },
];

export type Partner = {
  id: number;
  name: string;
  logo: string;
};

export type Certificate = {
  id: string;
  recipient?: string;
  institution?: string;
  degree?: string;
  graduationDate?: string;
  issueDate?: string;
  expiryDate?: string | null;
  blockchainId?: string;
  blockchainTimestamp?: string;
  isValid: boolean;
  error?: string;
  qrCodeUrl?: string;
};
