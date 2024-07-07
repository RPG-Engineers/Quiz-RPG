import React, { useState } from 'react';
import TagCreationCard from '../components/TagCreationCard';
import TagEditionCard from '../components/TagEditionCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

type Tag = {
  id: string;
  name: string;
  color: string;
};

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleCreate = (name: string, color: string) => {
    const newTag: Tag = { id: Date.now().toString(), name, color };
    setTags([...tags, newTag]);
  };

  const handleEdit = (id: string) => {
    const tagToEdit = tags.find(tag => tag.id === id);
    if (tagToEdit) setEditingTag(tagToEdit);
  };

  const handleSave = (id: string, name: string, color: string) => {
    setTags(tags.map(tag => (tag.id === id ? { ...tag, name, color } : tag)));
    setEditingTag(null);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
  };

  const handleDelete = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <div className="container h-100 mt-3">
      <TagCreationCard onCreate={handleCreate} />
      {editingTag && (
        <TagEditionCard tag={editingTag} onSave={handleSave} onCancel={handleCancelEdit} />
      )}
      <div className="row align-items-center h-100 mt-3">
        {tags.map(tag => (
          <div key={tag.id} className="col-6 mx-auto my-2">
            <div className="card bg-light">
              <div className="card-body d-flex align-items-center justify-content-between">
                <span className="badge" style={{ backgroundColor: tag.color, color: '#ffffff' }}>{tag.name}</span>
                <div>
                  <button type="button" className="btn btn-warning text-white me-2" onClick={() => handleEdit(tag.id)}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(tag.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
