-- Create translations table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category, key)
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow full access for authenticated users" ON site_settings
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert default translations for Greek
INSERT INTO site_settings (category, key, value)
VALUES 
  ('translations', 'el', '{"site.title": "Sportiko.eu - Η Ψηφιακή Πλατφόρμα για Αθλητικούς Συλλόγους", "site.description": "Διαχειρίσου έσοδα, έξοδα, εγκρίσεις, ταμείο και ρόλους με διαφάνεια και επαγγελματισμό", "hero.title": "👉 Η Ψηφιακή Πλατφόρμα για τον Αθλητικό σας Σύλλογο", "hero.subtitle": "Διαχειρίσου έσοδα, έξοδα, εγκρίσεις, ταμείο και ρόλους με διαφάνεια και επαγγελματισμό – όλα από ένα σημείο.", "hero.cta.primary": "✅ Ξεκινήστε Δωρεάν", "hero.cta.secondary": "💼 Δείτε Παρουσίαση", "intro.title": "💡 Εισαγωγική Παράγραφος", "intro.text": "Το Sportiko είναι μια σύγχρονη εφαρμογή σχεδιασμένη για να καλύψει τις ανάγκες οικονομικής διαχείρισης κάθε είδους αθλητικού συλλόγου ή σωματείου. Είτε πρόκειται για ποδόσφαιρο, μπάσκετ, βόλεϊ, καράτε ή πολιτιστικό σύλλογο, το Sportiko σας προσφέρει ένα εύχρηστο και ασφαλές περιβάλλον για να οργανώνετε, να καταγράφετε και να ελέγχετε κάθε οικονομική κίνηση και εσωτερική διαδικασία.", "features.section.title": "🔧 Τι μπορείτε να κάνετε με το Sportiko:", "features.income.title": "💰 Καταγραφή Εσόδων & Εξόδων", "features.income.item1": "Με κατηγορίες και επιμέρους στοιχεία", "features.income.item2": "Επίσημες ή ανεπίσημες συναλλαγές", "features.income.item3": "Πληρωμένες ή εκκρεμείς", "features.income.item4": "Επισυνάψτε παραστατικά ή αποδείξεις", "features.roles.title": "👥 Διαχωρισμός Ρόλων", "features.roles.item1": "Διοίκηση (διαχειρίζεται τα πάντα)", "features.roles.item2": "Ταμίας (εγκρίνει συναλλαγές)", "features.roles.item3": "Μέλος Δ.Σ. (καταχωρεί και παρακολουθεί)", "features.approvals.title": "✅ Εγκρίσεις Συναλλαγών", "features.approvals.item1": "Πίνακας ταμία για έγκριση/απόρριψη", "features.approvals.item2": "Ιστορικό ποιος υπέβαλε και ποιος ενέκρινε", "features.reports.title": "📊 Αναφορές & Ισοζύγια", "features.reports.item1": "Ταμείο με πραγματικό υπόλοιπο", "features.reports.item2": "Μηνιαίες αναφορές εσόδων/εξόδων", "features.reports.item3": "Εξαγωγή σε Excel ή PDF", "features.customization.title": "🔗 Προσαρμοσμένα Κουμπιά & Συνδέσμοι", "features.customization.item1": "Φόρμες παρουσιών, προπονήσεων, αξιολογήσεων", "features.customization.item2": "Ανοίγουν εύκολα μέσα από το μενού \"Platform\"", "footer.text": "© 2024 Sportiko. Όλα τα δικαιώματα κατοχυρωμένα."}')
ON CONFLICT (category, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- Insert default translations for English
INSERT INTO site_settings (category, key, value)
VALUES 
  ('translations', 'en', '{"site.title": "Sportiko.eu - The Digital Platform for Sports Clubs", "site.description": "Manage income, expenses, approvals, treasury and roles with transparency and professionalism", "hero.title": "👉 The Digital Platform for your Sports Club", "hero.subtitle": "Manage income, expenses, approvals, treasury and roles with transparency and professionalism – all from one place.", "hero.cta.primary": "✅ Start for Free", "hero.cta.secondary": "💼 View Presentation", "intro.title": "💡 Introduction", "intro.text": "Sportiko is a modern application designed to meet the financial management needs of any type of sports club or association. Whether it\'s football, basketball, volleyball, karate or a cultural club, Sportiko offers you a user-friendly and secure environment to organize, record and control every financial transaction and internal procedure.", "features.section.title": "🔧 What you can do with Sportiko:", "features.income.title": "💰 Record Income & Expenses", "features.income.item1": "With categories and detailed information", "features.income.item2": "Official or unofficial transactions", "features.income.item3": "Paid or pending", "features.income.item4": "Attach documents or receipts", "features.roles.title": "👥 Role Separation", "features.roles.item1": "Administration (manages everything)", "features.roles.item2": "Treasurer (approves transactions)", "features.roles.item3": "Board Member (records and monitors)", "features.approvals.title": "✅ Transaction Approvals", "features.approvals.item1": "Treasurer dashboard for approval/rejection", "features.approvals.item2": "History of who submitted and who approved", "features.reports.title": "📊 Reports & Balance Sheets", "features.reports.item1": "Treasury with real balance", "features.reports.item2": "Monthly income/expense reports", "features.reports.item3": "Export to Excel or PDF", "features.customization.title": "🔗 Custom Buttons & Links", "features.customization.item1": "Forms for attendance, training, evaluations", "features.customization.item2": "Open easily through the \"Platform\" menu", "footer.text": "© 2024 Sportiko. All rights reserved."}')
ON CONFLICT (category, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();