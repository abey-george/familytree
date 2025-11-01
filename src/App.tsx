import FamilyTree from './components/FamilyTree';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <h1>Family Tree</h1>
          <p>Explore your family heritage</p>
        </div>
      </header>
      
      <div className="main-content">
        <FamilyTree />
      </div>
    </div>
  );
}

export default App;
