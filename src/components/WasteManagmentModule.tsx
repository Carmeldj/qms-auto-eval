import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Download, Save, ArrowLeft } from 'lucide-react';
import { PharmaceuticalWasteEntry, PharmaceuticalWasteDocument } from '../types/waste';
import { WasteService } from '../services/WasteService';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

export default function WasteManagementModule() {
    const navigate = useNavigate();

    const [structureName, setStructureName] = useState('');
    const [structureAddress, setStructureAddress] = useState('');
    const [responsibleName, setResponsibleName] = useState('');
    const [entries, setEntries] = useState<PharmaceuticalWasteEntry[]>([]);
    const [savedDocuments, setSavedDocuments] = useState<PharmaceuticalWasteDocument[]>([]);
    const [showSaved, setShowSaved] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        loadSavedDocuments();
    }, []);

    const loadSavedDocuments = async () => {
        try {
            const docs = await WasteService.getAllDocuments();
            setSavedDocuments(docs);
        } catch (error) {
            console.error('Error loading documents:', error);
        }
    };

    const addRow = () => {
        const newEntry: PharmaceuticalWasteEntry = {
            structureName,
            structureAddress,
            responsibleName,
            productName: '',
            internationalName: '',
            batchNumber: '',
            manufacturer: '',
            manufacturerCountry: '',
            productNature: '',
            expiryDate: '',
            quantity: 0,
            unitPrice: 0,
            totalPrice: 0
        };
        setEntries([...entries, newEntry]);
    };

    const updateEntry = (index: number, field: keyof PharmaceuticalWasteEntry, value: string | number) => {
        const updated = [...entries];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'quantity' || field === 'unitPrice') {
            const quantity = field === 'quantity' ? Number(value) : updated[index].quantity;
            const unitPrice = field === 'unitPrice' ? Number(value) : updated[index].unitPrice;
            updated[index].totalPrice = quantity * unitPrice;
        }

        setEntries(updated);
    };

    const deleteRow = (index: number) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!structureName || !structureAddress || !responsibleName) {
            alert('Veuillez remplir les informations de la structure');
            return;
        }

        if (entries.length === 0) {
            alert('Veuillez ajouter au moins une ligne de déchet');
            return;
        }

        try {
            const document: PharmaceuticalWasteDocument = {
                structureName,
                structureAddress,
                responsibleName,
                entries,
                createdAt: new Date().toISOString()
            };

            await WasteService.saveDocument(document);
            alert('Document enregistré avec succès!');

            setStructureName('');
            setStructureAddress('');
            setResponsibleName('');
            setEntries([]);

            loadSavedDocuments();
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Erreur lors de l\'enregistrement du document');
        }
    };

    const handleExportByPeriod = () => {
        if (!startDate || !endDate) {
            alert('Veuillez sélectionner une période (date de début et date de fin)');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            alert('La date de début doit être antérieure à la date de fin');
            return;
        }

        const filteredDocs = savedDocuments.filter(doc => {
            const docDate = new Date(doc.createdAt);
            return docDate >= start && docDate <= end;
        });

        if (filteredDocs.length === 0) {
            alert('Aucun document trouvé pour cette période');
            return;
        }

        const allEntries: PharmaceuticalWasteEntry[] = [];
        filteredDocs.forEach(doc => {
            allEntries.push(...doc.entries);
        });

        generatePDF(allEntries);
    };

    const generatePDF = (entries: PharmaceuticalWasteEntry[]) => {
        const doc = new jsPDF('landscape', 'mm', 'a4');

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Liste des Déchets Pharmaceutiques', 148, 15, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Période: ${startDate} au ${endDate}`, 148, 23, { align: 'center' });

        const headers = [
            'Nom du produit',
            'DCI',
            'N° de lot',
            'Fabricant',
            'Pays du fabricant',
            'Nature du produit',
            'Date de péremption',
            'Quantité',
            'Prix cession unitaire',
            'Prix cession total'
        ];
        const startY = 32;
        const rowHeight = 9;
        const colWidths = [28, 28, 20, 28, 26, 26, 24, 18, 25, 25];

        const drawHeaders = (yPos: number) => {
            let x = 10;
            doc.setFillColor(52, 211, 153);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');

            headers.forEach((header, i) => {
                doc.rect(x, yPos, colWidths[i], rowHeight, 'F');
                const lines = doc.splitTextToSize(header, colWidths[i] - 2);
                const textHeight = lines.length * 3;
                const startTextY = yPos + (rowHeight - textHeight) / 2 + 3;
                lines.forEach((line: string, lineIndex: number) => {
                    doc.text(line, x + colWidths[i] / 2, startTextY + (lineIndex * 3), { align: 'center' });
                });
                x += colWidths[i];
            });
        };

        let y = startY;
        drawHeaders(y);

        y += rowHeight;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');

        entries.forEach((entry, index) => {
            if (y > 185) {
                doc.addPage('a4', 'landscape');
                y = 15;
                drawHeaders(y);
                y += rowHeight;
            }

            const rowData = [
                entry.productName.substring(0, 30),
                entry.internationalName.substring(0, 30),
                entry.batchNumber,
                entry.manufacturer.substring(0, 25),
                entry.manufacturerCountry.substring(0, 22),
                entry.productNature.substring(0, 22),
                entry.expiryDate,
                entry.quantity.toString(),
                entry.unitPrice.toFixed(2),
                entry.totalPrice.toFixed(2)
            ];

            let x = 10;
            rowData.forEach((cell, i) => {
                doc.rect(x, y, colWidths[i], rowHeight);
                doc.text(cell, x + 2, y + 6);
                x += colWidths[i];
            });

            y += rowHeight;
        });

        const totalPrice = entries.reduce((sum, entry) => sum + entry.totalPrice, 0);
        y += 8;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total général: ${totalPrice.toFixed(2)} DZD`, 220, y);

        doc.save(`dechets_pharmaceutiques_${startDate}_${endDate}.pdf`);
    };

    const loadDocument = (doc: PharmaceuticalWasteDocument) => {
        setStructureName(doc.structureName);
        setStructureAddress(doc.structureAddress);
        setResponsibleName(doc.responsibleName);
        setEntries(doc.entries);
        setShowSaved(false);
    };

    const deleteDocument = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
            try {
                await WasteService.deleteDocument(id);
                loadSavedDocuments();
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Erreur lors de la suppression du document');
            }
        }
    };

    if (showSaved) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-3 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                        <button
                            onClick={() => setShowSaved(false)}
                            className="flex items-center text-emerald-600 hover:text-emerald-700"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Retour
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Documents Enregistrés</h1>
                        <div className="hidden sm:block w-24"></div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-emerald-600 text-white">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm">Date</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm">Structure</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm">Responsable</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm">Nb Lignes</th>
                                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {savedDocuments.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm">
                                                {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm">{doc.structureName}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm">{doc.responsibleName}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm">{doc.entries.length}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                <div className="flex justify-center gap-2 flex-col sm:flex-row">
                                                    <button
                                                        onClick={() => loadDocument(doc)}
                                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        Charger
                                                    </button>
                                                    <button
                                                        onClick={() => doc.id && deleteDocument(doc.id)}
                                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {savedDocuments.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    Aucun document enregistré
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-3 sm:p-8">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <button
                        onClick={() => {
                            navigate("/")
                        }}
                        className="flex items-center text-emerald-600 hover:text-emerald-700"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Retour
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Liste des Déchets Pharmaceutiques</h1>
                    </div>
                    <button
                        onClick={() => setShowSaved(true)}
                        className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Voir les documents
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Exporter par période</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="sm:col-span-2 md:col-span-1">
                                <button
                                    onClick={handleExportByPeriod}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                                >
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                    Exporter PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom de la structure *
                            </label>
                            <input
                                type="text"
                                value={structureName}
                                onChange={(e) => setStructureName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Nom de la pharmacie"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adresse de la structure *
                            </label>
                            <input
                                type="text"
                                value={structureAddress}
                                onChange={(e) => setStructureAddress(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Adresse complète"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom et contact du Responsable *
                            </label>
                            <input
                                type="text"
                                value={responsibleName}
                                onChange={(e) => setResponsibleName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Nom du responsable"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                        <button
                            onClick={addRow}
                            className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm sm:text-base"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Ajouter une ligne
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                        >
                            <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Enregistrer le document
                        </button>
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                                <table className="w-full border-collapse min-w-[1200px]">
                                    <thead>
                                        <tr className="bg-emerald-600 text-white">
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Nom du produit</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">DCI</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">N° de lot</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Fabricant</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Pays du fabricant</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Nature du produit</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Date de péremption</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Quantité</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Prix cession unitaire</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Prix cession total</th>
                                            <th className="border border-gray-300 px-3 py-2 text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.map((entry, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={entry.productName}
                                                        onChange={(e) => updateEntry(index, 'productName', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={entry.internationalName}
                                                        onChange={(e) => updateEntry(index, 'internationalName', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={entry.batchNumber}
                                                        onChange={(e) => updateEntry(index, 'batchNumber', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={entry.manufacturer}
                                                        onChange={(e) => updateEntry(index, 'manufacturer', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={entry.manufacturerCountry}
                                                        onChange={(e) => updateEntry(index, 'manufacturerCountry', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <select
                                                        value={entry.productNature}
                                                        onChange={(e) => updateEntry(index, 'productNature', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    >
                                                        <option value="">Sélectionner...</option>
                                                        <option value="Médicaments">Médicaments</option>
                                                        <option value="Compléments alimentaires">Compléments alimentaires</option>
                                                        <option value="Cosmétiques">Cosmétiques</option>
                                                        <option value="Dispositifs médicaux">Dispositifs médicaux</option>
                                                        <option value="Stupéfiants">Stupéfiants</option>
                                                        <option value="Psychotropes">Psychotropes</option>
                                                    </select>
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="date"
                                                        value={entry.expiryDate}
                                                        onChange={(e) => updateEntry(index, 'expiryDate', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={entry.quantity || ''}
                                                        onChange={(e) => updateEntry(index, 'quantity', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={entry.unitPrice || ''}
                                                        onChange={(e) => updateEntry(index, 'unitPrice', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border-0 focus:ring-1 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1 text-center text-sm font-medium">
                                                    {entry.totalPrice.toFixed(2)}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1 text-center">
                                                    <button
                                                        onClick={() => deleteRow(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Supprimer la ligne"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {entries.length === 0 && (
                                    <div className="text-center py-12 text-gray-500 border border-gray-300 border-t-0 text-sm sm:text-base">
                                        Cliquez sur "Ajouter une ligne" pour commencer
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {entries.length > 0 && (
                        <div className="mt-6 flex justify-center sm:justify-end">
                            <div className="bg-emerald-50 px-4 sm:px-6 py-3 sm:py-4 rounded-lg">
                                <p className="text-base sm:text-lg font-semibold text-gray-800">
                                    Total général: {entries.reduce((sum, entry) => sum + entry.totalPrice, 0).toFixed(2)} DH
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}