# PDF Upload and Save Implementation

## Overview
This document describes the implementation of automatic PDF upload and save functionality across all PDF generation points in the PHARMA QMS application.

## New Helper Module

### `src/utils/pdfUploadHelper.ts`
A comprehensive helper module that provides utilities for:
- Converting jsPDF objects to Blobs
- Downloading PDFs locally
- Uploading PDFs to the server
- Combined upload and download workflow

### Key Functions

#### `generateUploadAndDownloadPDF()`
The main function that handles both upload and download:
```typescript
generateUploadAndDownloadPDF(
  pdf: jsPDF,
  fileName: string,
  metadata: Partial<DocumentUploadMetadata>,
  options: {
    upload?: boolean;
    download?: boolean;
  } = { upload: true, download: true }
): Promise<{ blob: Blob; fileName: string }>
```

**Features:**
- Automatically uploads PDF to server with metadata
- Downloads PDF locally for user
- Handles errors gracefully (downloads locally even if upload fails)
- Configurable upload/download options

## Updated Services

The following services have been updated to automatically upload and save generated PDFs:

### 1. **ProcedureService** (`src/services/ProcedureService.ts`)
- **PDFs**: Procedure documents
- **Metadata**: Title, author, version, procedure type
- **Category**: Procédures
- **Tags**: procédure, standard/autre

### 2. **TraceabilityService** (`src/services/TraceabilityService.ts`)
- **PDFs**: 
  - Individual traceability records
  - Monthly compilations
- **Metadata**: Template title, user email, record ID
- **Category**: Registres
- **Tags**: traçabilité, registre, category

### 3. **ActionPlanService** (`src/services/ActionPlanService.ts`)
- **PDFs**: Corrective and preventive action plans
- **Metadata**: Pharmacy name, responsible person, inspection date
- **Category**: Inspection
- **Tags**: plan-action, inspection, capa

### 4. **CAPAService** (`src/services/CAPAService.ts`)
- **PDFs**: CAPA (Corrective and Preventive Actions) plans
- **Metadata**: Pharmacy name, quality manager, period
- **Category**: Documents
- **Tags**: capa, plan-action, qualité

### 5. **ProcessReviewService** (`src/services/ProcessReviewService.ts`)
- **PDFs**: Process review reports
- **Metadata**: Process name, pilot name, review year
- **Category**: Processus
- **Tags**: revue, processus, year

### 6. **QualityManualService** (`src/services/QualityManualService.ts`)
- **PDFs**: Quality manual
- **Metadata**: Pharmacy name, quality manager, titulaire
- **Category**: Documents
- **Tags**: manuel, qualité, iso-9001

### 7. **InspectionReportService** (`src/services/InspectionReportService.ts`)
- **PDFs**: Inspection reports
- **Metadata**: Pharmacy info, pharmacist name, inspection date
- **Category**: Inspection
- **Tags**: inspection, rapport, auto-inspection

### 8. **ProcessSheetService** (`src/services/ProcessSheetService.ts`)
- **PDFs**: Process description sheets
- **Metadata**: Process code, process name, responsible person
- **Category**: Processus
- **Tags**: processus, fiche

### 9. **ProcessMappingService** (`src/services/ProcessMappingService.ts`)
- **PDFs**: Process mapping/cartography
- **Metadata**: Standard mapping information
- **Category**: Processus
- **Tags**: cartographie, processus, iso-9001

### 10. **DocumentForm** (`src/components/Document/DocumentForm.tsx`)
- Already implemented - serves as the reference implementation

## Services Not Yet Updated

The following services still need to be updated:

### Pending Updates:
1. **OrdonnancierService** - Prescription register reports
2. **WasteService** / WasteManagementModule - Waste management reports
3. **RegisterListService** - Various register lists
4. **MissingProductsService** - Missing products reports
5. **MonthlyCompilationService** - Monthly compilation reports
6. **AdverseEventService** - Adverse event reports
7. **IndicatorsReviewModule** - Indicator review PDFs
8. **IndicatorTrackingModule** - Indicator tracking PDFs
9. **SWOTAnalysis** - SWOT analysis PDFs
10. **PESTELAnalysis** - PESTEL analysis PDFs
11. **Results** (Assessment) - Assessment results PDFs

## How to Update Additional Services

To add upload functionality to any remaining service:

1. **Import the helper and types:**
```typescript
import { generateUploadAndDownloadPDF } from '../utils/pdfUploadHelper';
import { DocumentAccessLevel, DocumentStatus } from '../types/documents';
```

2. **Replace `pdf.save(fileName)` with:**
```typescript
await generateUploadAndDownloadPDF(pdf, fileName, {
  title: 'Document Title',
  type: 'Document Type',
  category: 'Category',
  description: 'Document description',
  author: 'Author name',
  version: '1.0',
  accessLevel: DocumentAccessLevel.RESTRICTED,
  status: DocumentStatus.DRAFT,
  tags: ['tag1', 'tag2'],
});
```

3. **For non-async functions, use `.catch()` for error handling:**
```typescript
generateUploadAndDownloadPDF(pdf, fileName, metadata).catch(error => {
  console.error('Error uploading PDF:', error);
  // PDF was already downloaded, so just log the error
});
```

## Benefits

✅ **Automatic Upload**: All PDFs are automatically uploaded to the server
✅ **Automatic Download**: Users still get local copies
✅ **Centralized Storage**: All documents stored in one place
✅ **Metadata Tracking**: Rich metadata for search and organization
✅ **Error Resilience**: Downloads work even if upload fails
✅ **No User Impact**: Users experience no change in workflow
✅ **Audit Trail**: Complete history of generated documents

## Document Metadata

Each uploaded document includes:
- **title**: Human-readable document title
- **type**: Document type (e.g., "Procédure", "Inspection")
- **category**: Document category for organization
- **description**: Detailed description
- **author**: Creator name or email
- **version**: Document version (default: "1.0")
- **accessLevel**: Access control (default: RESTRICTED)
- **status**: Document status (default: DRAFT)
- **tags**: Array of tags for searching
- **filePath**: Server path to PDF file
- **fileSize**: Formatted file size
- **fileType**: "application/pdf"

## Testing

To verify the implementation works:

1. Generate any document that has been updated
2. Check that the PDF downloads locally
3. Verify the document appears in the Documents module
4. Confirm metadata is correct
5. Test download from Documents module

## Future Enhancements

- Add option to skip local download (server-only save)
- Implement versioning for updated documents
- Add batch upload for multiple PDFs
- Implement PDF preview before upload
- Add document approval workflow
