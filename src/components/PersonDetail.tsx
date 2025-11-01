import { X, MapPin, Briefcase, Calendar, Users, Heart } from 'lucide-react';
import type { Person } from '../types/family';

interface PersonDetailProps {
  person: Person | null;
  onClose: () => void;
  familyData: Person[];
}

const PersonDetail = ({ person, onClose, familyData }: PersonDetailProps) => {
  if (!person) return null;

  // Find related family members
  const parents = person.parentIds
    ? familyData.filter(p => person.parentIds?.includes(p.id))
    : [];
  
  const spouse = person.spouseId
    ? familyData.find(p => p.id === person.spouseId)
    : null;
  
  const children = familyData.filter(p => 
    p.parentIds?.includes(person.id)
  );

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Photo */}
        <div className="modal-header">
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close"
          >
            <X />
          </button>
          
          <div className="header-content">
            {person.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="photo-large"
              />
            ) : (
              <div className="photo-placeholder-large">
                <Users />
              </div>
            )}
            
            <h2>{person.name}</h2>
            
            <div className="generation-badge-large">
              <span>
                Generation {person.generation}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Basic Info */}
          <div className="info-grid">
            {person.occupation && (
              <div className="info-item">
                <div className="icon-wrapper">
                  <Briefcase />
                </div>
                <div className="info-text">
                  <p className="label">Occupation</p>
                  <p className="value">{person.occupation}</p>
                </div>
              </div>
            )}

            {person.location && (
              <div className="info-item">
                <div className="icon-wrapper">
                  <MapPin />
                </div>
                <div className="info-text">
                  <p className="label">Location</p>
                  <p className="value">{person.location}</p>
                </div>
              </div>
            )}

            {person.birthDate && (
              <div className="info-item">
                <div className="icon-wrapper">
                  <Calendar />
                </div>
                <div className="info-text">
                  <p className="label">Born</p>
                  <p className="value">{person.birthDate}</p>
                </div>
              </div>
            )}

            {person.deathDate && (
              <div className="info-item">
                <div className="icon-wrapper icon-wrapper-burgundy">
                  <Calendar />
                </div>
                <div className="info-text">
                  <p className="label">Passed</p>
                  <p className="value">{person.deathDate}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {person.description && (
            <div className="description-section">
              <h3>About</h3>
              <p>{person.description}</p>
            </div>
          )}

          {/* Family Relationships */}
          {(parents.length > 0 || spouse || children.length > 0) && (
            <div className="relationships-section">
              <h3 className="section-title">
                <Users />
                Family Relationships
              </h3>
              
              <div>
                {parents.length > 0 && (
                  <div className="relationship-group">
                    <p className="relationship-label">Parents</p>
                    <div className="relationship-tags">
                      {parents.map(parent => (
                        <span
                          key={parent.id}
                          className="tag tag-teal"
                        >
                          {parent.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {spouse && (
                  <div className="relationship-group">
                    <p className="relationship-label">
                      <Heart />
                      Spouse
                    </p>
                    <span className="tag tag-burgundy">
                      {spouse.name}
                    </span>
                  </div>
                )}

                {children.length > 0 && (
                  <div className="relationship-group">
                    <p className="relationship-label">Children</p>
                    <div className="relationship-tags">
                      {children.map(child => (
                        <span
                          key={child.id}
                          className="tag tag-gold"
                        >
                          {child.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonDetail;
