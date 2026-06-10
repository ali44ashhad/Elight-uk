import mongoose from 'mongoose';

const investorsLoungeSubmissionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    terms: { type: [String], default: [] },
  },
  { timestamps: true }
);

investorsLoungeSubmissionSchema.index({ createdAt: -1 });
investorsLoungeSubmissionSchema.index({ emailAddress: 1, createdAt: -1 });

export const InvestorsLoungeSubmission = mongoose.model(
  'InvestorsLoungeSubmission',
  investorsLoungeSubmissionSchema
);

