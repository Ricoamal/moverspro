import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AdminNotes = ({ quote, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote.trim(),
        author: 'Current Admin', // In real app, get from auth context
        timestamp: new Date().toISOString(),
        type: 'admin'
      };
      
      onAddNote(quote.id, note);
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNoteIcon = (type) => {
    switch (type) {
      case 'admin':
        return 'User';
      case 'system':
        return 'Settings';
      case 'customer':
        return 'MessageCircle';
      default:
        return 'FileText';
    }
  };

  const getNoteColor = (type) => {
    switch (type) {
      case 'admin':
        return 'bg-blue-50 border-blue-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      case 'customer':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="FileText" size={20} className="mr-2" />
          Administrative Notes
        </h2>
        
        {!isAddingNote && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNote(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <Input
              label="Add Administrative Note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
              className="w-full"
            />
            
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                iconName="Check"
                iconPosition="left"
              >
                Add Note
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {quote.adminNotes && quote.adminNotes.length > 0 ? (
          quote.adminNotes.map((note) => (
            <div key={note.id} className={`p-4 rounded-lg border ${getNoteColor(note.type)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Icon name={getNoteIcon(note.type)} size={16} className="mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{note.author}</span>
                  <span className="text-xs text-gray-500 ml-2 capitalize">({note.type})</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(note.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No administrative notes yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add notes to track important information about this quote
            </p>
          </div>
        )}
      </div>

      {/* Audit Trail */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Audit Trail</h3>
        <div className="space-y-2">
          {quote.auditTrail && quote.auditTrail.map((entry, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <Icon name="Clock" size={14} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">{entry.action}</span>
                <span className="text-xs text-gray-500 ml-2">by {entry.user}</span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTimestamp(entry.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotes;