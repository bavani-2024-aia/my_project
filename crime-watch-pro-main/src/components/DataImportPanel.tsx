import { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ImportedRecord {
  id: string;
  location: string;
  crimeType: string;
  date: string;
  time?: string;
  coordinates?: { lat: number; lng: number };
  dataQuality: 'complete' | 'partial' | 'estimated';
}

interface DataImportPanelProps {
  onImportComplete?: (records: ImportedRecord[]) => void;
}

const DataImportPanel = ({ onImportComplete }: DataImportPanelProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{
    total: number;
    complete: number;
    partial: number;
    estimated: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const processFile = async (file: File) => {
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }
    
    setImportedFile(file);
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate file processing with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setProgress(i);
    }
    
    // Simulate parsing results
    const total = Math.floor(Math.random() * 500) + 100;
    const complete = Math.floor(total * 0.45);
    const partial = Math.floor(total * 0.35);
    const estimated = total - complete - partial;
    
    setImportResult({ total, complete, partial, estimated });
    setIsProcessing(false);
    
    // Generate mock imported records
    const mockRecords: ImportedRecord[] = Array.from({ length: total }, (_, i) => ({
      id: `import-${i + 1}`,
      location: ['Bus Stand', 'Market Area', 'Railway Station', 'Temple Zone'][Math.floor(Math.random() * 4)],
      crimeType: ['Theft', 'Harassment', 'Fight', 'Robbery'][Math.floor(Math.random() * 4)],
      date: '2024-01-' + String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
      time: Math.random() > 0.4 ? `${Math.floor(Math.random() * 24)}:00` : undefined,
      coordinates: Math.random() > 0.3 ? { lat: 11.0168 + (Math.random() - 0.5) * 0.1, lng: 76.9558 + (Math.random() - 0.5) * 0.1 } : undefined,
      dataQuality: i < complete ? 'complete' : i < complete + partial ? 'partial' : 'estimated'
    }));
    
    onImportComplete?.(mockRecords);
    toast.success(`Imported ${total} records from ${file.name}`);
  };
  
  const resetImport = () => {
    setImportedFile(null);
    setImportResult(null);
    setProgress(0);
  };
  
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-blue-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <FileSpreadsheet className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold">Import Crime Data</h3>
            <p className="text-xs text-muted-foreground">Upload CSV or Excel files</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Drop Zone */}
        {!importedFile && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-secondary/30'
              }
            `}
          >
            <Upload className={`h-10 w-10 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Drop file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports CSV, XLS, XLSX formats
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
        
        {/* Processing State */}
        {isProcessing && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium">Processing {importedFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Parsing records and estimating missing data...
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {/* Import Result */}
        {importResult && !isProcessing && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium">Import Successful</p>
                  <p className="text-xs text-muted-foreground">{importedFile?.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={resetImport}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Data Quality Breakdown */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Data Quality Report
              </h4>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                  <p className="text-lg font-bold text-emerald-400">{importResult.complete}</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                  <p className="text-lg font-bold text-amber-400">{importResult.partial}</p>
                  <p className="text-xs text-muted-foreground">Partial</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg text-center">
                  <p className="text-lg font-bold text-red-400">{importResult.estimated}</p>
                  <p className="text-xs text-muted-foreground">Estimated</p>
                </div>
              </div>
              
              <div className="p-2 bg-secondary/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    <strong>{importResult.estimated + importResult.partial}</strong> records had missing time/location data. 
                    Values were estimated using nearby records and category mapping.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Total: {importResult.total} records imported
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataImportPanel;
