import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import PersonNode from './PersonNode';
import PersonDetail from './PersonDetail';
import { useFamilyData } from '../hooks/useFamilyData';
import type { Person } from '../types/family';
import { Loader2 } from 'lucide-react';

const nodeTypes = {
  person: PersonNode,
};

const FamilyTree = () => {
  const { familyData, loading, error } = useFamilyData();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Build nodes and edges from family data
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!familyData) {
      return { initialNodes: [], initialEdges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Group people by generation and family unit
    const generationGroups = new Map<number, Person[]>();
    familyData.people.forEach(person => {
      const gen = person.generation;
      if (!generationGroups.has(gen)) {
        generationGroups.set(gen, []);
      }
      generationGroups.get(gen)!.push(person);
    });

    // Calculate positions with better spacing for family units
    const verticalSpacing = 400; // Increased for clearer lines
    const cardWidth = 192; // 12rem = 192px
    const spouseOffset = 210; // Close gap between spouses
    const minGapBetweenPairs = 100; // Minimum gap between different child-spouse pairs
    const horizontalSpacing = cardWidth + spouseOffset + minGapBetweenPairs; // Total space per child-spouse pair

    generationGroups.forEach((people, generation) => {
      const genIndex = generation - 1;
      
      // Separate parents and spouses
      const parents = people.filter(p => p.parentIds && p.parentIds.length > 0);
      const spouses = people.filter(p => p.spouseId && !p.parentIds);
      const rootPeople = people.filter(p => !p.parentIds && !p.spouseId);

      let currentX = 0;

      // Position root generation (no parents) - centered
      if (rootPeople.length > 0) {
        // Center the couple around x=0
        // Place first person to the left, spouse to the right
        const halfGap = spouseOffset / 2;
        
        rootPeople.forEach((person) => {
          const spouse = people.find(p => p.spouseId === person.id);
          
          if (spouse) {
            // Position couple symmetrically around x=0
            nodes.push({
              id: person.id,
              type: 'person',
              position: { x: -halfGap - cardWidth, y: genIndex * verticalSpacing },
              data: { person, onPersonClick: setSelectedPerson },
            });
            
            nodes.push({
              id: spouse.id,
              type: 'person',
              position: { x: halfGap, y: genIndex * verticalSpacing },
              data: { person: spouse, onPersonClick: setSelectedPerson },
            });
          } else {
            // Single person, center them at x=0
            nodes.push({
              id: person.id,
              type: 'person',
              position: { x: -cardWidth / 2, y: genIndex * verticalSpacing },
              data: { person, onPersonClick: setSelectedPerson },
            });
          }
        });
      }

      // Position children under their parents
      if (parents.length > 0) {
        const parentGroups = new Map<string, Person[]>();
        parents.forEach(person => {
          const parentKey = person.parentIds!.sort().join('-');
          if (!parentGroups.has(parentKey)) {
            parentGroups.set(parentKey, []);
          }
          parentGroups.get(parentKey)!.push(person);
        });

        // Calculate total width needed for all children including final spouse
        const pairSpacing = cardWidth + spouseOffset + minGapBetweenPairs;
        const groupGap = 200;
        let totalChildrenWidth = 0;
        
        parentGroups.forEach((children) => {
          // Each child takes pairSpacing, but we need to account for the last child's spouse too
          totalChildrenWidth += children.length * pairSpacing;
        });
        totalChildrenWidth += (parentGroups.size - 1) * groupGap; // Add gaps between groups
        totalChildrenWidth += spouseOffset; // Add space for the last spouse
        
        // Center all children as a group
        let currentGroupX = -totalChildrenWidth / 2;
        
        parentGroups.forEach((children, parentKey) => {
          const parentIds = parentKey.split('-');
          
          // Position this family group's children
          children.forEach((child, index) => {
            const childX = currentGroupX + index * pairSpacing;
            
            nodes.push({
              id: child.id,
              type: 'person',
              position: { x: childX, y: genIndex * verticalSpacing },
              data: { person: child, onPersonClick: setSelectedPerson },
            });

            // Position spouse next to child
            const spouse = people.find(p => p.spouseId === child.id);
            if (spouse) {
              nodes.push({
                id: spouse.id,
                type: 'person',
                position: { x: childX + spouseOffset, y: genIndex * verticalSpacing },
                data: { person: spouse, onPersonClick: setSelectedPerson },
              });
            }

            // Create direct edges from both parents to child
            parentIds.forEach(parentId => {
              edges.push({
                id: `${parentId}-${child.id}`,
                source: parentId,
                target: child.id,
                type: 'straight',
                animated: false,
                style: { stroke: 'rgba(13, 115, 119, 0.5)', strokeWidth: 1.5 },
              });
            });
          });
          
          // Move to next family group position
          currentGroupX += children.length * pairSpacing + groupGap;
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [familyData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when family data changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleCloseDetail = useCallback(() => {
    setSelectedPerson(null);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="spinner" />
          <p>Loading family tree...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-title">Error loading family data</p>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        fitViewOptions={{ padding: 0.15 }}
      >
        <Background color="#0D7377" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor="#0D7377"
          maskColor="rgba(13, 115, 119, 0.1)"
        />
      </ReactFlow>

      {selectedPerson && (
        <PersonDetail
          person={selectedPerson}
          onClose={handleCloseDetail}
          familyData={familyData?.people || []}
        />
      )}
    </div>
  );
};

export default FamilyTree;
