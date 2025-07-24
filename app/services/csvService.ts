// services/csvService.js
import { addDoc, collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

export const csvService = {
  // Parse CSV file and save directly to Firestore
  uploadAndProcessCSV: async (fileUri, fileName, userId) => {
    try {
      // Read the CSV file
      const response = await fetch(fileUri);
      const csvText = await response.text();
      
      // Parse CSV content
      const parsedLeads = parseCSVText(csvText);
      
      if (parsedLeads.length === 0) {
        throw new Error('No valid leads found in CSV file');
      }

      // Use batch write for better performance
      const batch = writeBatch(db);
      const leadsToAdd = [];

      // Create CSV upload record
      const csvUploadRef = doc(collection(db, 'csvUploads'));
      const csvUploadData = {
        fileName,
        userId,
        uploadedAt: new Date(),
        leadsCount: parsedLeads.length,
        status: 'processing'
      };
      batch.set(csvUploadRef, csvUploadData);

      // Add leads to batch
      parsedLeads.forEach((lead, index) => {
        const leadRef = doc(collection(db, 'leads'));
        const leadData = {
          ...lead,
          userId,
          csvUploadId: csvUploadRef.id,
          createdAt: new Date(),
          source: 'csv_upload',
          orderIndex: index
        };
        batch.set(leadRef, leadData);
        leadsToAdd.push({ id: leadRef.id, ...leadData });
      });

      // Update CSV upload status
      batch.update(csvUploadRef, { status: 'completed' });

      // Commit batch
      await batch.commit();

      return {
        csvUploadId: csvUploadRef.id,
        leads: leadsToAdd,
        fileName,
        leadsCount: parsedLeads.length
      };

    } catch (error) {
      console.error('Error processing CSV file:', error);
      throw error;
    }
  },

  // Get all leads for a user
  getUserLeads: async (userId) => {
    try {
      const q = query(
        collection(db, 'leads'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const leads = [];
      
      querySnapshot.forEach((doc) => {
        leads.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by creation date (newest first)
      return leads.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return bTime - aTime;
      });

    } catch (error) {
      console.error('Error getting user leads:', error);
      throw error;
    }
  },

  // Get CSV upload history
  getUserCSVUploads: async (userId) => {
    try {
      const q = query(
        collection(db, 'csvUploads'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const uploads = [];
      
      querySnapshot.forEach((doc) => {
        uploads.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return uploads.sort((a, b) => {
        const aTime = a.uploadedAt?.toDate?.() || new Date(a.uploadedAt) || new Date(0);
        const bTime = b.uploadedAt?.toDate?.() || new Date(b.uploadedAt) || new Date(0);
        return bTime - aTime;
      });

    } catch (error) {
      console.error('Error getting CSV uploads:', error);
      throw error;
    }
  },

  // Add single lead manually
  addLead: async (leadData, userId) => {
    try {
      const lead = {
        ...leadData,
        userId,
        createdAt: new Date(),
        source: 'manual_entry',
        initial: leadData.name?.charAt(0)?.toUpperCase() || '?'
      };

      const docRef = await addDoc(collection(db, 'leads'), lead);
      
      return {
        id: docRef.id,
        ...lead
      };

    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  },

  // Delete lead
  deleteLead: async (leadId) => {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // Update lead
  updateLead: async (leadId, updateData) => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        ...updateData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }
};

// Helper function to parse CSV text
const parseCSVText = (csvText) => {
  try {
    const lines = csvText.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    // Parse headers - handle quoted values and trim whitespace
    const headers = parseCSVLine(lines[0]).map(header => 
      header.toLowerCase().trim()
    );

    const leads = [];
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const values = parseCSVLine(line);
      const lead = {};
      
      // Map values to headers
      headers.forEach((header, index) => {
        lead[header] = values[index] || '';
      });
      
      // Skip rows without essential data
      if (!lead.name && !lead.phone) {
        continue;
      }
      
      // Generate initial for display
      if (lead.name) {
        lead.initial = lead.name.charAt(0).toUpperCase();
      }
      
      // Standardize field names if needed
      if (lead.email && !lead.phone) {
        // If only email is provided, still include the lead
      }
      
      leads.push(lead);
    }
    
    return leads;

  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file. Please check the file format.');
  }
};

// Helper function to parse a single CSV line (handles quoted values)
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last value
  values.push(current.trim());
  
  return values;
};