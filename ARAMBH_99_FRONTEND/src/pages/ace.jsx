import React from 'react';
import AceBody from '../components/ace_body';
import SideBar from '../components/side_bar';
import PersonalGuide from '../components/personal_guide';
import CollegeComparison from '../components/college_comp';
import AdmissionGuidance from '../components/admission_query';


function Ace() {
  const [activeButton, setActiveButton] = React.useState(null);

  React.useEffect(() => {
    const handleSideBarChange = (event) => {
      setActiveButton(event.detail);
      console.log(event.detail);
    };
    window.addEventListener('sideBarChange', handleSideBarChange);
    return () => window.removeEventListener('sideBarChange', handleSideBarChange);
  }, []);

  const renderBody = () => {
    switch (activeButton) {
      case 'personalizedGuidance':
        return <PersonalGuide />;
      case 'collegeComparison':
        return <CollegeComparison />;
      case 'admissionGuidance':
        return <AdmissionGuidance/>;
      case null:
        return <AceBody />;
      default:
        return <AceBody />;
    }
  };

  return (
    <div>
      <center>
        <SideBar />
        {renderBody()}
      </center>
    </div>
  );
}

export default Ace;
