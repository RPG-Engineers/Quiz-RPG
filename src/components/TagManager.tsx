import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Tag from './Tag';
import TagCreationCard from './TagCreationCard';

const TagManager: React.FC = () => {
  const [tags, setTags] = useState<{ text: string; color: string; togglable: boolean }[]>([]);

  const handleCreateTag = (text: string, color: string) => {
    setTags([...tags, { text, color, togglable}]);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <TagCreationCard onCreate={handleCreateTag} />
        </Col>
      </Row>
      <Row>
        <Col>
          {tags.map((tag, index) => (
            <Tag key={index} text={tag.text} color={tag.color} togglable={tag.togglable} />
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default TagManager;
