import React, {
  useEffect,
  useState,
  useCallback,
  useRef
} from 'react';
import {
  faEnvelope, faEllipsisV, faHeart, faDiceOne, faDiceTwo,
  faDiceThree, faDiceFour, faDiceFive, faDiceSix, faComputer
} from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import ADSAlphanumericDialPad from './ADSAlphanumericDialPad';
import ADSButton from './ADSButton';
import ADSSplitButton from './ADSSplitButton';
import ADSIconButton from './ADSIconButton';
import ADSTabGroup from './ADSTabGroup';
import ADSTabList from './ADSTabList';
import ADSTab from './ADSTab';
import ADSPanelList from './ADSPanelList';
import ADSPanel from './ADSPanel';
import ADSAlert from './ADSAlert';
import ADSTooltip from './ADSTooltip';
import ADSSingleLineTextField from './ADSSingleLineTextField';
import ADSMultiLineTextField from './ADSMultiLineTextField';
import ADSRadioButton from './ADSRadioButton';
import ADSCheckbox from './ADSCheckbox';
import ADSProgressIndicator from './ADSProgressIndicator';
import ADSRadioButtonGroup from './ADSRadioButtonGroup';
import ADSCheckboxGroup from './ADSCheckboxGroup';
import ADSToggleSwitch from './ADSToggleSwitch';
import ADSInsetDivider from './ADSInsetDivider';
import ADSFullWidthDivider from './ADSFullWidthDivider';
import ADSMenuButton from './ADSMenuButton';
import ADSSlider from './ADSSlider';
import ADSButtonGroup from './ADSButtonGroup';
import ADSGroupButton from './ADSGroupButton';
import ADSPagination from './ADSPagination';
import DialogGallery from './DialogGallery';
import ADSFileUpload from './ADSFileUpload';
import ADSAccordion from './ADSAccordion';
import ADSNumberInput from './ADSNumberInput';
import ADSStepper from './Components/ADSStepper';
import ADSTreeView from './Components/ADSTreeView';
import ADSLink from './Components/ADSLink';
// import ADSVideoComponent from './ADSVideoComponent';

import './Sandbox.css';
import ADSSingleSelectDropdownBox from './ADSSingleSelectDropdownBox';
import ADSNavigationRailPanel from './Components/ADSNavigationRailPanel';
import ADSSidebarMenu from './Components/ADSSidebarMenu';
import { ADSTileGroup } from './ADSTileGroup';

// JSON used to populate arrow tree
const arrowJSON = require('./Assets/JSON/IPCTSconfig.json');

export default function Sandbox() {
  const treeRef = useRef();
  // Reference state object here for team
  const [example, setExample] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDangerAlert, setShowDangerAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);

  const [singleLineText, setSingleLineText] = useState('');
  // phone number text field values
  // all text fields should have their own state
  const [singleLinePhoneNumber1, setSingleLinePhoneNumber1] = useState('');
  const [singleLinePhoneNumber2, setSingleLinePhoneNumber2] = useState('');
  const [singleLinePhoneNumber3, setSingleLinePhoneNumber3] = useState('');
  const [singleLinePhoneNumber4, setSingleLinePhoneNumber4] = useState('');
  const [singleLinePhoneNumber5, setSingleLinePhoneNumber5] = useState('');
  const [singleLinePhoneNumber6, setSingleLinePhoneNumber6] = useState('');
  const [singleLinePhoneNumber7, setSingleLinePhoneNumber7] = useState('');
  const [singleLinePhoneNumber8, setSingleLinePhoneNumber8] = useState('');
  const [singleLinePhoneNumber9, setSingleLinePhoneNumber9] = useState('');

  // For Dial Pad
  const numPressed = useCallback((event: React.FormEvent<HTMLButtonElement>, digit: string) => {
    // console.log(`ADSDialPad number: ${digit}`);
    if (singleLinePhoneNumber1.length < 10) {
      setSingleLinePhoneNumber1(singleLinePhoneNumber1 + digit);
    }
  }, [singleLinePhoneNumber1]);

  const [multiLineText, setMultiLineText] = useState('');

  const [dropdownBoxSelected1, setDropdownBoxSelected1] = useState({});
  const [dropdownBoxSelected2, setDropdownBoxSelected2] = useState({});
  const [dropdownBoxSelected3, setDropdownBoxSelected3] = useState({});
  const [dropdownBoxSelected4, setDropdownBoxSelected4] = useState({});
  const [dropdownBoxSelected5, setDropdownBoxSelected5] = useState({});
  const [dropdownBoxSelected6, setDropdownBoxSelected6] = useState({});
  const [dropdownBoxSelected7, setDropdownBoxSelected7] = useState({});
  const [dropdownBoxSelected8, setDropdownBoxSelected8] = useState({});
  const [dropdownBoxSelected9, setDropdownBoxSelected9] = useState({});
  const [dropdownBoxSelected10, setDropdownBoxSelected10] = useState({});
  const [dropdownBoxSelected11, setDropdownBoxSelected11] = useState({});
  const [dropdownBoxSelected12, setDropdownBoxSelected12] = useState({});

  const [menuButtonSelected1, setMenuButtonSelected1] = useState({});
  const [menuButtonSelected2, setMenuButtonSelected2] = useState({});
  const [menuButtonSelected3, setMenuButtonSelected3] = useState({});
  const [menuButtonSelected4, setMenuButtonSelected4] = useState({});
  const [menuButtonSelected5, setMenuButtonSelected5] = useState({});
  const [menuButtonSelected6, setMenuButtonSelected6] = useState({});
  const [menuButtonSelected7, setMenuButtonSelected7] = useState({});
  const [menuButtonSelected8, setMenuButtonSelected8] = useState({});

  const [paginationPage, setPaginationPage] = useState(1);

  const [stepperElements, setStepperElements] = useState([
    {
      id: 'firstOption', label: 'First Option', isActive: true, isComplete: false
    },
    {
      id: 'secondOption', label: 'Second Option', isActive: false, isComplete: false
    },
    {
      id: 'thirdOption', label: 'Third Option', isActive: false, isComplete: false
    },
    {
      id: 'fourthOption', label: 'Fourth Option', isActive: false, isComplete: false
    },
    {
      id: 'fifthOption', label: 'Fifth Option', isActive: false, isComplete: false
    }
  ]);

  useEffect(() => {
    // Put any functions we want to run when the component loads here
    setExample('Sandbox');
  }, []);

  function logDropdownObject(obj: any) {
    if (Object.keys(obj).length > 0) {
      // console.log(obj);
    }
  }

  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected1);
  }, [dropdownBoxSelected1]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected2);
  }, [dropdownBoxSelected2]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected3);
  }, [dropdownBoxSelected3]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected4);
  }, [dropdownBoxSelected4]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected5);
  }, [dropdownBoxSelected5]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected6);
  }, [dropdownBoxSelected6]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected7);
  }, [dropdownBoxSelected7]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected8);
  }, [dropdownBoxSelected8]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected9);
  }, [dropdownBoxSelected9]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected10);
  }, [dropdownBoxSelected10]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected11);
  }, [dropdownBoxSelected11]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(dropdownBoxSelected12);
  }, [dropdownBoxSelected12]);

  // Example of the wrong way.
  // function sayHello() {
  //   console.log('Hello from Click!');
  // }

  // Example of the correct way.
  const sayHello = useCallback(() => {
    console.log('Hello from Click!');
    // remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const triggerSuccessAlert = useCallback(() => {
    setShowSuccessAlert(!showSuccessAlert);
  }, [showSuccessAlert]);

  const triggerDangerAlert = useCallback(() => {
    setShowDangerAlert(!showDangerAlert);
  }, [showDangerAlert]);

  const triggerInfoAlert = useCallback(() => {
    setShowInfoAlert(!showInfoAlert);
  }, [showInfoAlert]);

  const triggerWarningAlert = useCallback(() => {
    setShowWarningAlert(!showWarningAlert);
  }, [showWarningAlert]);

  const updatePaginationPage = (value: any) => {
    setPaginationPage(value);
  };

  const updateSingleLineText = (value: any) => {
    // Update the parent component when the child component changes the text value
    setSingleLineText(value);
  };

  // Separate functions to update each phone number input
  const updateSingleLinePhoneNumber1 = (value: any) => {
    setSingleLinePhoneNumber1(value);
  };

  const updateSingleLinePhoneNumber2 = (value: any) => {
    setSingleLinePhoneNumber2(value);
  };

  const updateSingleLinePhoneNumber3 = (value: any) => {
    setSingleLinePhoneNumber3(value);
  };

  const updateSingleLinePhoneNumber4 = (value: any) => {
    setSingleLinePhoneNumber4(value);
  };

  const updateSingleLinePhoneNumber5 = (value: any) => {
    setSingleLinePhoneNumber5(value);
  };

  const updateSingleLinePhoneNumber6 = (value: any) => {
    setSingleLinePhoneNumber6(value);
  };

  const updateSingleLinePhoneNumber7 = (value: any) => {
    setSingleLinePhoneNumber7(value);
  };

  const updateSingleLinePhoneNumber8 = (value: any) => {
    setSingleLinePhoneNumber8(value);
  };

  const updateSingleLinePhoneNumber9 = (value: any) => {
    setSingleLinePhoneNumber9(value);
  };
  const updateMultiLineText = (value: any) => {
    // Update the parent component when the child component changes the text value
    setMultiLineText(value);
  };

  const slideChangeFunction = (value: any) => {
    console.log(value);
  };

  const numberInputChangeFunction = (value: any) => {
    console.log(value);
  };

  const options = [
    { id: '0', value: '', label: '-- Select --' },
    { id: '1', value: 'one', label: 'One' },
    { id: '2', value: 'two', label: 'Two' },
    { id: '3', value: 'three', label: 'Three' },
    { id: '4', value: 'four', label: 'Four' },
    { id: '5', value: 'five', label: 'Five' },
    { id: '6', value: 'six', label: 'Six' }
  ];

  const basicMenuButtonOptions = [
    { id: '1', value: 'one', label: 'One' },
    { id: '2', value: 'two', label: 'Two' },
    { id: '3', value: 'three', label: 'Three' },
    { id: '4', value: 'four', label: 'Four' },
    { id: '5', value: 'five', label: 'Five' },
    { id: '6', value: 'six', label: 'Six' }
  ];
  const basicMenuButtonOptionsWithIcons = [
    {
      icon: faDiceOne, id: '1', value: 'one', label: 'One'
    },
    {
      icon: faDiceTwo, id: '2', value: 'two', label: 'Two'
    },
    {
      icon: faDiceThree, id: '3', value: 'three', label: 'Three'
    },
    {
      icon: faDiceFour, id: '4', value: 'four', label: 'Four'
    },
    {
      icon: faDiceFive, id: '5', value: 'five', label: 'Five'
    },
    {
      icon: faDiceSix, id: '6', value: 'six', label: 'Six'
    }
  ];

  const menuButtonOptionsWithSubMenu = [
    {
      icon: faDiceOne,
      id: '1',
      value: 'one',
      label: 'One',
      items: [
        {
          id: '1', value: 'sone', label: 'sOne'
        },
        {
          id: '2',
          value: 'stwo',
          label: 'sTwo',
          items: [
            {
              icon: faDiceOne, id: '1', value: 'tone', label: 'tOne'
            },
            {
              icon: faDiceTwo, id: '2', value: 'ttwo', label: 'tTwo'
            }
          ]
        }
      ]
    },
    {
      icon: faDiceTwo, id: '2', value: 'two', label: 'Two'
    },
    {
      icon: faDiceThree, id: '3', value: 'three', label: 'Three'
    },
    {
      icon: faDiceFour, id: '4', value: 'four', label: 'Four'
    },
    {
      icon: faDiceFive, id: '5', value: 'five', label: 'Five'
    },
    {
      icon: faDiceSix, id: '6', value: 'six', label: 'Six'
    }
  ];

  const basicMenuOptionsWithDivider = [
    { id: '1', value: 'one', label: 'One' },
    { id: '2', value: 'two', label: 'Two' },
    { id: '3', value: 'three', label: 'Three' },
    { value: 'divider' },
    { id: '4', value: 'four', label: 'Four' }
  ];

  const basicMenuOptionsWithDividerAndIcons = [
    {
      icon: faDiceOne, id: '1', value: 'one', label: 'One'
    },
    {
      icon: faDiceTwo, id: '2', value: 'two', label: 'Two'
    },
    {
      icon: faDiceThree, id: '3', value: 'three', label: 'Three'
    },
    { value: 'divider' },
    {
      icon: faDiceFour, id: '4', value: 'four', label: 'Four'
    }
  ];

  const basicMenuOptionsWithDividerIconsAndDivider = [
    {
      icon: faDiceOne, id: '1', value: 'one', label: 'One'
    },
    {
      icon: faDiceTwo, id: '2', value: 'two', label: 'Two'
    },
    {
      icon: faDiceThree, id: '3', value: 'three', label: 'Three'
    },
    { value: 'divider' },
    {
      icon: faDiceFour,
      id: '4',
      value: 'four',
      label: 'Four',
      items: [
        { id: '5', value: 'five', label: 'Five' },
        { id: '6', value: 'six', label: 'Six' }
      ]
    }
  ];

  const menuButtonOptionsGroupWithGroups = [
    {
      value: 'group',
      label: 'Group 1',
      items: [
        { id: '1', value: 'one', label: 'One' },
        { id: '2', value: 'two', label: 'Two' },
        { id: '3', value: 'three', label: 'Three' }
      ]
    },
    { value: 'divider' },
    {
      value: 'group',
      label: 'Group 2',
      items: [
        {
          id: '1', value: 'one', label: 'One', icon: faDiceOne
        },
        {
          id: '2',
          value: 'two',
          label: 'Two',
          icon: faDiceTwo,
          items: [
            { id: '1', value: 'one', label: 'One' },
            { id: '2', value: 'two', label: 'Two' },
            { id: '3', value: 'three', label: 'Three' }
          ]
        },
        {
          id: '3', value: 'three', label: 'Three', icon: faDiceThree
        }
      ]
    }
  ];

  // Action should be the redirect path or function that fires when menu item is clicked
  const navigationMenuItems = [
    {
      icon: faDiceOne, id: 'one', label: 'One', action: '/sandbox'
    },
    {
      icon: faDiceTwo, id: 'two', label: 'Two', action: '/sandbox'
    },
    {
      icon: faDiceThree, id: 'three', label: 'Three', action: '/sandbox'
    },
    {
      icon: faDiceFour, id: 'four', label: 'Four', action: '/sandbox'
    },
    { value: 'divider', id: 'divider' },
    {
      icon: faDiceFive, id: 'five', label: 'Five', action: '/sandbox'
    },
    {
      icon: faDiceSix, id: 'six', label: 'Six', action: '/sandbox'
    }
  ];

  const sidebarMenuItems = [
    {
      id: 'study-basics', label: 'Study Basics'
    },
    {
      id: 'module-configuration', label: 'Module Configuration'
    },
    {
      id: 'data-collection', label: 'Data Collection'
    },
    {
      id: 'study-data', label: 'Study Data'
    }
  ];

  const updateDropdownBoxSelected1 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected1(value);
  };
  const updateDropdownBoxSelected2 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected2(value);
  };
  const updateDropdownBoxSelected3 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected3(value);
  };
  const updateDropdownBoxSelected4 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected4(value);
  };
  const updateDropdownBoxSelected5 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected5(value);
  };
  const updateDropdownBoxSelected6 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected6(value);
  };
  const updateDropdownBoxSelected7 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected7(value);
  };
  const updateDropdownBoxSelected8 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected8(value);
  };
  const updateDropdownBoxSelected9 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected9(value);
  };
  const updateDropdownBoxSelected10 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected10(value);
  };
  const updateDropdownBoxSelected11 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected11(value);
  };
  const updateDropdownBoxSelected12 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setDropdownBoxSelected12(value);
  };

  // Functions for updating menu button selection
  const updateMenuButtonSelected1 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected1(value);
    console.log(menuButtonSelected1); // printing this to prevent lint error
  };
  const updateMenuButtonSelected2 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected2(value);
    console.log(menuButtonSelected2); // printing this to prevent lint error
  };
  const updateMenuButtonSelected3 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected3(value);
    console.log(menuButtonSelected3); // printing this to prevent lint error
  };
  const updateMenuButtonSelected4 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected4(value);
    console.log(menuButtonSelected4); // printing this to prevent lint error
  };
  const updateMenuButtonSelected5 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected5(value);
    console.log(menuButtonSelected5); // printing this to prevent lint error
  };
  const updateMenuButtonSelected6 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected6(value);
    console.log(menuButtonSelected6); // printing this to prevent lint error
  };
  const updateMenuButtonSelected7 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected7(value);
    console.log(menuButtonSelected7); // printing this to prevent lint error
  };
  const updateMenuButtonSelected8 = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setMenuButtonSelected8(value);
    console.log(menuButtonSelected8); // printing this to prevent lint error
  };
  // End functions for updating menu button selection

  // Previous or Next button for Stepper component
  const prevNextButtonClicked = (step: string) => {
    const newData = [...stepperElements];

    // get active element
    const activeIndex = newData.findIndex((element) => element.isActive === true);
    if (step === 'next' && activeIndex < newData.length - 1) {
      newData[activeIndex].isComplete = true;
      newData[activeIndex].isActive = false;
      newData[activeIndex + 1].isActive = true;
    } else if (step === 'previous' && activeIndex > 0) {
      newData[activeIndex].isActive = false;
      newData[activeIndex - 1].isComplete = false;
      newData[activeIndex - 1].isActive = true;
    }
    setStepperElements(newData);
  };

  const reportTreeData = (item: any, event: any) => {
    console.log(`DATA FROM TREE ${JSON.stringify(item)} ${event.itemIndex}`);
  };
  // const nodeData = (e: any) => {
  //   console.log(`DATA FROM TREE ${JSON.stringify(e)}`);
  // };

  const linkFunction = () => {
    console.log('click');
  };

  const pad = {
    padding: '5px 30px 20px'
  };

  enum Heights { 'small', 'medium', 'large' }

  const uploadFileSuccess = (value: any) => {
    console.log(value);
  };

  const deleteFileSuccess = (value: any) => {
    console.log(value);
  };

  return (
    <main>
      <div className="h1 pad" style={pad}>
        <ADSTooltip content="This is an ACE Design System Component Sandbox tooltip" placement="bottom">
          <span>This is an ACE Design System Component {example}</span>
        </ADSTooltip>
      </div>
      <div className="h2" style={pad}>Alerts</div>
      <ADSAlert
        alertText="This is a success alert. This will automatically close in 10 seconds."
        alertType="success"
        isDismissible
        autoClose
        showAlert={showSuccessAlert}
        setShowAlert={setShowSuccessAlert}
        fontType="body1"
      />

      <ADSAlert
        alertText="This is a danger alert. This will persist until dismissed."
        alertType="danger"
        isDismissible
        autoClose={false}
        showAlert={showDangerAlert}
        setShowAlert={setShowDangerAlert}
        fontType="body1"
      />
      <ADSAlert
        alertText="This is an info alert. This will persist until dismissed"
        alertType="info"
        isDismissible
        autoClose={false}
        showAlert={showInfoAlert}
        setShowAlert={setShowInfoAlert}
        fontType="body1"
      />
      <ADSAlert
        alertText="This is a warning alert. This will persist until dismissed"
        alertType="warning"
        isDismissible
        autoClose={false}
        showAlert={showWarningAlert}
        setShowAlert={setShowWarningAlert}
        fontType="body1"
      />

      <div style={pad}>Alert triggers! &nbsp; &nbsp;
        <ADSButton
          onClick={triggerSuccessAlert}
          buttonText={`Click me to ${showSuccessAlert ? 'hide' : 'show'} success alert.`}
        /> &nbsp; &nbsp;
        <ADSButton
          onClick={triggerDangerAlert}
          buttonText={`Click me to ${showDangerAlert ? 'hide' : 'show'} danger alert.`}
        /> &nbsp; &nbsp;
        <ADSButton
          onClick={triggerInfoAlert}
          buttonText={`Click me to ${showInfoAlert ? 'hide' : 'show'} info alert.`}
        /> &nbsp; &nbsp;
        <ADSButton
          onClick={triggerWarningAlert}
          buttonText={`Click me to ${showWarningAlert ? 'hide' : 'show'} warning alert.`}
        />
      </div>

      <div className="h2" style={pad}>Button</div>
      <div style={pad}>
        <table>
          <tbody>
            <tr>
              <th> </th>
              <th>Primary</th>
              <th>Secondary</th>
              <th>Tertiary</th>
            </tr>
            {(Object.keys(Heights) as (keyof typeof Heights)[])
              .filter((height) => Number.isNaN(Number(height)))
              .map((height) => (
                <React.Fragment key={`button${height}`}>
                  <tr>
                    <td>{height.charAt(0).toUpperCase() + height.slice(1)}</td>
                    <td>
                      <ADSButton
                        onClick={sayHello}
                        buttonText="Primary Button"
                        height={height}
                      />
                      <div>&nbsp;</div>
                      <ADSMenuButton
                        buttonText="Primary Menu Button"
                        variant="primary"
                        height={height}
                        menuOptions={basicMenuButtonOptions}
                        menuWidth="200px"
                        setMenuOption={() => null}
                        menuButtonID={`test_menuButtonID1_${height}`}
                        menuID={`test_menuID1_${height}`}
                      />
                      <div>&nbsp;</div>
                      <ADSSplitButton
                        buttonText="Primary Split Button"
                        variant="primary"
                        height={height}
                        onButtonClick={sayHello}
                        menuOptions={basicMenuOptionsWithDividerIconsAndDivider}
                        menuWidth="200px"
                        onItemClick={() => null}
                        menuButtonID={`test_splitButtonID1_${height}`}
                        menuID={`test_splitID1_${height}`}
                        menuButtonAriaLabel={`test menu ${height}`}
                      />
                    </td>
                    <td>
                      <ADSButton
                        onClick={sayHello}
                        buttonText="Secondary Button"
                        variant="secondary"
                        height={height}
                      />
                      <div>&nbsp;</div>
                      <ADSMenuButton
                        buttonText="Secondary Menu Button"
                        variant="secondary"
                        height={height}
                        menuOptions={basicMenuButtonOptions}
                        menuWidth="200px"
                        setMenuOption={() => null}
                        menuButtonID={`test_menuButtonID2_${height}`}
                        menuID={`test_menuID2_${height}`}
                      />
                      <div>&nbsp;</div>
                      <ADSSplitButton
                        buttonText="Secondary Split Button"
                        variant="secondary"
                        height={height}
                        onButtonClick={sayHello}
                        menuOptions={basicMenuButtonOptions}
                        menuWidth="200px"
                        onItemClick={() => null}
                        menuButtonID={`test_splitButtonID2_${height}`}
                        menuID={`test_splitID2_${height}`}
                        menuButtonAriaLabel={`test menu ${height}`}
                      />
                    </td>
                    <td>
                      <ADSButton
                        onClick={sayHello}
                        buttonText="Tertiary Button"
                        variant="tertiary"
                        height={height}
                      />
                      <div>&nbsp;</div>
                      <ADSMenuButton
                        buttonText="Tertiary Menu Button"
                        variant="tertiary"
                        fontType="button"
                        height={height}
                        menuOptions={basicMenuButtonOptions}
                        menuWidth="200px"
                        setMenuOption={() => null}
                        menuButtonID={`test_menuButtonID3_${height}`}
                        menuID={`test_menuID3_${height}`}
                      />
                    </td>
                  </tr>
                  <tr><td colSpan={4}><ADSFullWidthDivider /></td></tr>
                </React.Fragment>
              ))}

            {/* Disabled */}
            {(Object.keys(Heights) as (keyof typeof Heights)[])
              .filter((height) => Number.isNaN(Number(height)))
              .map((height) => (
                <tr key={`buttonDisabled${height}`}>
                  <td>{height.charAt(0).toUpperCase() + height.slice(1)}</td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Primary Button"
                      height={height}
                      disabled
                    />
                    <div>&nbsp;</div>
                    <ADSMenuButton
                      buttonText="Primary Menu Button"
                      variant="primary"
                      height={height}
                      disabled
                      menuOptions={basicMenuButtonOptions}
                      menuWidth="200px"
                      setMenuOption={() => null}
                      menuButtonID={`test_menuButtonID1_disabled_${height}`}
                      menuID={`test_menuID1_disabled_${height}`}
                    />
                    <div>&nbsp;</div>
                    <ADSSplitButton
                      buttonText="Primary Split Button"
                      variant="primary"
                      height={height}
                      disabled
                      onButtonClick={sayHello}
                      menuOptions={basicMenuOptionsWithDividerIconsAndDivider}
                      menuWidth="200px"
                      onItemClick={() => null}
                      menuButtonID={`test_splitButtonID1_disabled_${height}`}
                      menuID={`test_splitID1_disabled_${height}`}
                      menuButtonAriaLabel={`test menu ${height}`}
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Secondary Button"
                      variant="secondary"
                      height={height}
                      disabled
                    />
                    <div>&nbsp;</div>
                    <ADSMenuButton
                      buttonText="Secondary Menu Button"
                      variant="secondary"
                      height={height}
                      disabled
                      menuOptions={basicMenuButtonOptions}
                      menuWidth="200px"
                      setMenuOption={() => null}
                      menuButtonID={`test_menuButtonID2_disabled_${height}`}
                      menuID={`test_menuID2_disabled_${height}`}
                    />
                    <div>&nbsp;</div>
                    <ADSSplitButton
                      buttonText="Secondary Split Button"
                      variant="secondary"
                      height={height}
                      disabled
                      onButtonClick={sayHello}
                      menuOptions={basicMenuButtonOptions}
                      menuWidth="200px"
                      onItemClick={() => null}
                      menuButtonID={`test_splitButtonID2_disabled_${height}`}
                      menuID={`test_splitID2_disabled_${height}`}
                      menuButtonAriaLabel={`test menu ${height}`}
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Tertiary Button"
                      variant="tertiary"
                      height={height}
                      disabled
                    />
                    <div>&nbsp;</div>
                    <ADSMenuButton
                      buttonText="Tertiary Menu Button"
                      variant="tertiary"
                      fontType="button"
                      height={height}
                      disabled
                      menuOptions={basicMenuButtonOptions}
                      menuWidth="200px"
                      setMenuOption={() => null}
                      menuButtonID={`test_menuButtonID3_disabled_${height}`}
                      menuID={`test_menuID3_disabled_${height}`}
                    />
                  </td>
                </tr>
              ))}
            <tr><td colSpan={4}><ADSFullWidthDivider /></td></tr>
            {/* With Icon */}

            {(Object.keys(Heights) as (keyof typeof Heights)[])
              .filter((height) => Number.isNaN(Number(height)))
              .map((height) => (
                <tr key={`icon${height}`}>
                  <td>{height.charAt(0).toUpperCase() + height.slice(1)} with icon</td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Primary Button"
                      height={height}
                      icon={faEnvelope}
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Secondary Button"
                      variant="secondary"
                      height={height}
                      icon={faEnvelope}
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Tertiary Button"
                      variant="tertiary"
                      height={height}
                      icon={faEnvelope}
                    />
                  </td>
                </tr>
              ))}
            {/* With Icon Disabled */}
            {(Object.keys(Heights) as (keyof typeof Heights)[])
              .filter((height) => Number.isNaN(Number(height)))
              .map((height) => (
                <tr key={`buttonIconDisabled${height}`}>
                  <td>{height.charAt(0).toUpperCase() + height.slice(1)} with icon Disabled</td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Primary Button"
                      height={height}
                      icon={faEnvelope}
                      disabled
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Secondary Button"
                      variant="secondary"
                      height={height}
                      icon={faEnvelope}
                      disabled
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="Tertiary Button"
                      variant="tertiary"
                      height={height}
                      icon={faEnvelope}
                      disabled
                    />
                  </td>
                </tr>
              ))}
            <tr><td colSpan={4}><ADSFullWidthDivider /></td></tr>
            {/* Min 64px */}
            {(Object.keys(Heights) as (keyof typeof Heights)[])
              .filter((height) => Number.isNaN(Number(height)))
              .map((height) => (
                <tr key={`64Button${height}`}>
                  <td>{height.charAt(0).toUpperCase() + height.slice(1)} Min 64px Width</td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="64"
                      height={height}
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="64"
                      variant="secondary"
                      height={height}
                    />
                  </td>
                  <td>
                    <ADSButton
                      onClick={sayHello}
                      buttonText="64"
                      variant="tertiary"
                      height={height}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="h2" style={pad}>Icon Button</div>
      {(Object.keys(Heights) as (keyof typeof Heights)[])
        .filter((height) => Number.isNaN(Number(height)))
        .map((height) => (
          <div style={pad} key={`iconButton${height}`}>
            <div>{height.charAt(0).toUpperCase() + height.slice(1)} Min 64px Width</div>
            <div style={{ display: 'float' }}>
              <ADSTooltip content="this is a standard icon button" placement="right">
                <ADSIconButton
                  onClick={sayHello}
                  variant="standard"
                  height={height}
                  icon={faHeart}
                  ariaLabel="standard icon"
                />
              </ADSTooltip> &nbsp; &nbsp;
              <ADSTooltip content="this is a disabled standard icon button" placement="right">
                <ADSIconButton
                  onClick={sayHello}
                  variant="standard"
                  height={height}
                  icon={faHeart}
                  ariaLabel="disabled standard icon button"
                  disabled
                />
              </ADSTooltip> &nbsp; &nbsp;
              <ADSTooltip content="this is a filled icon button" placement="right">
                <ADSIconButton
                  onClick={sayHello}
                  variant="filled"
                  height={height}
                  icon={faEnvelope}
                  ariaLabel="filled icon"
                />
              </ADSTooltip> &nbsp; &nbsp;
              <ADSTooltip content="this is a disabled filled icon button" placement="right">
                <ADSIconButton
                  onClick={sayHello}
                  variant="filled"
                  height={height}
                  icon={faEnvelope}
                  ariaLabel="disabled filled icon"
                  disabled
                />
              </ADSTooltip> &nbsp; &nbsp;
              <ADSTooltip content="this is an outlined icon button" placement="right">
                <ADSIconButton
                  onClick={sayHello}
                  variant="outlined"
                  height={height}
                  icon={faEllipsisV}
                  ariaLabel="outlined icon"
                />
              </ADSTooltip> &nbsp; &nbsp;
              <ADSTooltip content="this is a disabled outlined icon button" placement="right">
                <ADSIconButton
                  onClick={sayHello}
                  variant="outlined"
                  height={height}
                  icon={faEllipsisV}
                  ariaLabel="disabled outlined icon"
                  disabled
                />
              </ADSTooltip>
            </div>
          </div>
        ))}

      <div className="h2" style={pad}> Menus</div>
      <Container style={pad} no-gutters="true" fluid>
        <Row>
          <Col>
            <ADSMenuButton
              buttonText="Basic Menu"
              variant="primary"
              height="medium"
              menuOptions={basicMenuButtonOptions}
              menuWidth="200px"
              setMenuOption={updateMenuButtonSelected1}
              menuButtonID="menuButtonID1"
              menuID="menuID1"
            />
          </Col>
          <Col>
            <ADSMenuButton
              buttonText="Basic Menu with Icons"
              variant="primary"
              height="medium"
              menuOptions={basicMenuButtonOptionsWithIcons}
              menuWidth="200px"
              setMenuOption={updateMenuButtonSelected2}
              menuButtonID="menuButtonID2"
              menuID="menuID1"
            />
          </Col>
          <Col>
            <ADSMenuButton
              buttonText="Basic Menu with Divider"
              variant="primary"
              height="medium"
              menuOptions={basicMenuOptionsWithDivider}
              menuWidth="200px"
              setMenuOption={updateMenuButtonSelected3}
              menuButtonID="menuButtonID3"
              menuID="menuID1"
            />
          </Col>
          <Col>
            <ADSMenuButton
              buttonText="Menu with Divider and Icons"
              variant="primary"
              height="medium"
              menuOptions={basicMenuOptionsWithDividerAndIcons}
              menuWidth="200px"
              setMenuOption={updateMenuButtonSelected4}
              menuButtonID="menuButtonID4"
              menuID="menuID1"
            />
          </Col>
          <Col>
            <ADSMenuButton
              buttonText="Menu with Sub Menus"
              variant="primary"
              height="medium"
              menuOptions={menuButtonOptionsWithSubMenu}
              menuWidth="200px"
              setMenuOption={updateMenuButtonSelected5}
              menuButtonID="menuButtonID5"
              menuID="menuID1"
            />
          </Col>
          <Col>
            <ADSMenuButton
              buttonText="Menu with Sub Menu and Divider"
              variant="primary"
              height="medium"
              menuOptions={basicMenuOptionsWithDividerIconsAndDivider}
              menuWidth="200px"
              setMenuOption={updateMenuButtonSelected6}
              menuButtonID="menuButtonID6"
              menuID="menuID1"
            />
          </Col>
          <Col>
            <ADSMenuButton
              buttonText="Menu with Groups"
              variant="primary"
              height="medium"
              menuOptions={menuButtonOptionsGroupWithGroups}
              menuWidth="200px"
              setMenuOption={updateMenuButtonSelected7}
              menuButtonID="menuButtonID7"
              menuID="menuID1"
            />
          </Col>
          <Col>
            <ADSMenuButton
              buttonText="Menu with Different Widths"
              variant="primary"
              height="medium"
              menuOptions={menuButtonOptionsWithSubMenu}
              menuWidth="200px"
              subMenuWidth="500px"
              secondSubMenuWidth="128px"
              setMenuOption={updateMenuButtonSelected8}
              menuButtonID="menuButtonID8"
              menuID="menuID1"
            />
          </Col>

        </Row>
      </Container>

      <div className="h2" style={pad}>Tabs</div>
      <div style={pad}>
        Fullscreen Tabs
        <ADSTabGroup id="tab-group-1" isManual isFitted>
          <ADSTabList>
            <ADSTab>One</ADSTab>
            <ADSTab>Two</ADSTab>
            <ADSTab isDisabled>Three</ADSTab>
            <ADSTab>Four</ADSTab>
          </ADSTabList>
          <ADSPanelList>
            <ADSPanel>Content One</ADSPanel>
            <ADSPanel>Content Two</ADSPanel>
            <ADSPanel>Content Three</ADSPanel>
            <ADSPanel>Content Four</ADSPanel>
          </ADSPanelList>
        </ADSTabGroup>
      </div>
      <div style={pad}>
        Clustered Tabs
        <ADSTabGroup id="tab-group-2" isManual>
          <ADSTabList>
            <ADSTab>One</ADSTab>
            <ADSTab>Twoooooooooo</ADSTab>
            <ADSTab isDisabled>Three</ADSTab>
            <ADSTab>Four</ADSTab>
          </ADSTabList>
          <ADSPanelList>
            <ADSPanel>Content One</ADSPanel>
            <ADSPanel>Content Two</ADSPanel>
            <ADSPanel>Content Three</ADSPanel>
            <ADSPanel>Content Four</ADSPanel>
          </ADSPanelList>
        </ADSTabGroup>
      </div>

      <div className="h2" style={pad}>Tooltip</div>
      <div style={pad}>
        <ADSTooltip content="This is a tooltip for this text" placement="right">
          <span>Hover over this text</span>
        </ADSTooltip>
      </div>
      <div className="h2" style={pad}>Radio Button</div>
      <div style={pad}>
        <ADSRadioButtonGroup id="radio-vertical-group-example" label="Radio Group with Vertical Options">
          <ADSRadioButton
            label="enabled vertical radio 1"
            groupName="radio-vertical-group-example"
            selectChangeFunction={() => null}
          />
          <ADSRadioButton
            label="enabled vertical radio 2"
            groupName="radio-vertical-group-example"
            selectChangeFunction={() => null}
          />
          <ADSRadioButton
            label="enabled vertical radio 3"
            groupName="radio-vertical-group-example"
            selectChangeFunction={() => null}
          />
        </ADSRadioButtonGroup>
        <ADSRadioButtonGroup id="radio-horizontal-group-example" label="Radio Group with Horizontal Options">
          <ADSRadioButton
            inline
            label="enabled horizontal radio 1"
            groupName="radio-horizontal-group-example"
            selectChangeFunction={() => null}
          />
          <ADSRadioButton
            inline
            label="enabled horizontal radio 2"
            groupName="radio-horizontal-group-example"
            selectChangeFunction={() => null}
          />
          <ADSRadioButton
            inline
            label="enabled horizontal radio 3"
            groupName="radio-horizontal-group-example"
            selectChangeFunction={() => null}
          />
        </ADSRadioButtonGroup>
        <ADSRadioButtonGroup id="radio-disabled-buttons-example" label="Radio Group with Disabled Buttons">
          <ADSRadioButton
            label="one"
            groupName="radio-disabled-buttons-example"
            selectChangeFunction={() => null}
          />
          <ADSRadioButton
            label="two disabled radio button"
            groupName="radio-disabled-buttons-example"
            selectChangeFunction={() => null}
            disabled
          />
          <ADSRadioButton
            label="three"
            groupName="radio-disabled-buttons-example"
            selectChangeFunction={() => null}
          />
        </ADSRadioButtonGroup>
      </div>
      <div className="h2" style={pad}>Checkbox</div>
      <div style={pad}>
        <ADSCheckboxGroup id="checkbox-vertical-group-example" label="Checkbox Group with Vertical Options">
          <ADSCheckbox
            label="enabled vertical checkbox 1"
            valueChangeFunction={() => null}
          />
          <ADSCheckbox
            label="enabled vertical checkbox 2"
            valueChangeFunction={() => null}
          />
          <ADSCheckbox
            label="enabled vertical checkbox with help menu"
            valueChangeFunction={() => null}
            isHoverable
            hoverableText="This is example help text for the tooltip."
          />
        </ADSCheckboxGroup>
        <ADSCheckboxGroup id="checkbox-horizontal-group-example" label="Checkbox Group with Horizontal Options">
          <ADSCheckbox
            inline
            label="enabled horizontal checkbox 1"
            groupName="checkbox group"
            valueChangeFunction={() => null}
          />
          <ADSCheckbox
            inline
            label="enabled horizontal checkbox 2"
            groupName="checkbox group"
            valueChangeFunction={() => null}
          />
        </ADSCheckboxGroup>
        <ADSCheckbox
          label="enabled checkbox and not in the above group"
          valueChangeFunction={() => null}
        />
        <ADSCheckbox
          label="disabled checkbox"
          disabled
          valueChangeFunction={() => null}
        />
        <ADSCheckbox
          label="disabled checked"
          disabled
          checked
          valueChangeFunction={() => null}
        />
      </div>
      <div className="h2" style={pad}>Divider</div>
      <div style={pad}>
        Full Width
      </div>
      <ADSFullWidthDivider />
      <div style={pad}>
        Inset
      </div>
      <ADSInsetDivider />
      <div className="h2" style={pad}>Progress Indicator</div>
      <div style={pad}>
        Determinate Small Orange
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="orange"
          isDeterminate
          progress={25}
          height="progress-small"
        />
        Determinate Medium Orange
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="orange"
          isDeterminate
          progress={25}
          height="progress-medium"
        />
        Determinate Large Orange
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="orange"
          isDeterminate
          progress={25}
          height="progress-large"
        />
        Determinate Extra-Large Orange
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="orange"
          isDeterminate
          progress={25}
          height="progress-extra-large"
        />
        Determinate Small Blue
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="blue"
          isDeterminate
          progress={25}
          height="progress-small"
        />
        Determinate Medium Blue
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="blue"
          isDeterminate
          progress={25}
          height="progress-medium"
        />
        Determinate Large Blue
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="blue"
          isDeterminate
          progress={25}
          height="progress-large"
        />
        Determinate Extra-Large Blue
        <ADSProgressIndicator
          ariaLabel="Determinate Progress"
          color="blue"
          isDeterminate
          progress={25}
          height="progress-extra-large"
        />
        Indeterminate Small Orange
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="orange"
          height="progress-small"
        />
        Indeterminate Medium Orange
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="orange"
          height="progress-medium"
        />
        Indeterminate Large Orange
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="orange"
          height="progress-large"
        />
        Indeterminate Extra-Large Orange
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="orange"
          height="progress-extra-large"
        />
        Indeterminate Small Blue
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="blue"
          height="progress-small"
        />
        Indeterminate Medium Blue
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="blue"
          height="progress-medium"
        />
        Indeterminate Large Blue
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="blue"
          height="progress-large"
        />
        Indeterminate Extra-Large Blue
        <ADSProgressIndicator
          ariaLabel="Indeterminate Progress"
          color="blue"
          height="progress-extra-large"
        />

      </div>
      <div className="h2" style={pad}>Grid</div>
      <div id="grid-example" style={pad}>
        <p>Make your window much smaller to see the responsiveness of the grid.</p>
        <Container>
          {/* Stack the columns on mobile by making one full-width and the other half-width */}
          <Row>
            <Col sm={12} md={8}>
              sm=12 md=8
            </Col>
            <Col xs={6} md={4}>
              xs=6 md=4
            </Col>
          </Row>

          {/* Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop */}
          <Row>
            <Col xs={6} md={4}>
              xs=6 md=4
            </Col>
            <Col xs={6} md={4}>
              xs=6 md=4
            </Col>
            <Col xs={6} md={4}>
              xs=6 md=4
            </Col>
          </Row>

          {/* Columns are always 50% wide, on mobile and desktop */}
          <Row>
            <Col xs={6}>xs=6</Col>
            <Col xs={6}>xs=6</Col>
          </Row>
        </Container>
      </div>

      <div className="h2" style={pad}>Toggle Switches</div>
      <div style={pad}>
        <ADSToggleSwitch id="toggle-1" label="Enabled" onChangeFunction={() => null} />
        <ADSToggleSwitch id="toggle-2" label="Disabled" disabled onChangeFunction={() => null} />
      </div>
      <div className="h2" style={pad}>Sliders</div>
      <div style={pad}>
        <ADSSlider
          label="Unlabeled example with reset"
          changeFunction={slideChangeFunction}
          unmarked
          resetButton
        />
        <ADSSlider
          changeFunction={slideChangeFunction}
          label="Labeled example with reset"
          resetButton
        />
        <ADSSlider
          label="Disabled example with reset"
          changeFunction={slideChangeFunction}
          disabled
          resetButton
        />
        <ADSSlider
          label="Unlabeled example without reset"
          changeFunction={slideChangeFunction}
          unmarked
        />
        <ADSSlider
          changeFunction={slideChangeFunction}
          label="Labeled example without reset"
        />
        <ADSSlider
          label="Disabled example without reset"
          changeFunction={slideChangeFunction}
          disabled
        />
      </div>
      <div className="h2" style={pad}>Pagination</div>
      <div style={pad}>
        Page Number: {paginationPage}
        <ADSPagination totalPages={10} onChange={updatePaginationPage} />
      </div>
      <div className="h2" style={pad}> Single Line Text Field</div>
      <Container style={pad} no-gutters="true" fluid>
        <div className="h3" style={pad}>Small text field</div>
        <Row>
          <Col sm={2}>
            Plain
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="id1"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Text field with label"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="id2"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              hasDelete={false}
              fieldSize="small"
              elementID="id3"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Text field help text"
              hasDelete={false}
              fieldSize="small"
              elementID="id4"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Plain text field with label"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Plain text field with help text"
              hasDelete={false}
              fieldSize="small"
              elementID="id5"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            With delete
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              hasDelete
              fieldSize="small"
              elementID="id6"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Text field with label"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete
              fieldSize="small"
              elementID="id7"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              hasDelete
              fieldSize="small"
              elementID="id603"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Text field help text"
              hasDelete
              fieldSize="small"
              elementID="id8"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Plain text field with label"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Plain text field with help text"
              hasDelete
              fieldSize="small"
              elementID="id9"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            Character limit
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              maxLength={10}
              hasDelete={false}
              fieldSize="small"
              elementID="id10"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              maxLength={10}
              hasDelete
              fieldSize="small"
              elementID="id11"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Character limit"
              isFormLabelHidden={false}
              placeholderText=""
              maxLength={10}
              hasDelete
              fieldSize="small"
              elementID="id12"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Max length of 10"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Text field with help text"
              hasDelete
              maxLength={10}
              fieldSize="small"
              elementID="id13"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            Phone Number
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber1}
              setFormText={updateSingleLinePhoneNumber1}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isPhoneNumber
              hasDelete={false}
              fieldSize="small"
              elementID="id14"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber2}
              setFormText={updateSingleLinePhoneNumber2}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isPhoneNumber
              hasDelete
              fieldSize="small"
              elementID="id15"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber3}
              setFormText={updateSingleLinePhoneNumber3}
              formLabel="Enter Phone number"
              isFormLabelHidden={false}
              placeholderText=""
              helpText="Enter your phone number"
              isPhoneNumber
              hasDelete
              fieldSize="small"
              elementID="id16"
            />
          </Col>
        </Row>
        <div className="h3" style={pad}>Medium text field</div>
        <Row>
          <Col sm={2}>
            Plain
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              hasDelete={false}
              fieldSize="medium"
              elementID="id17"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Text field with label"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="medium"
              elementID="id18"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              hasDelete={false}
              fieldSize="medium"
              elementID="id19"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Text field help text"
              hasDelete={false}
              fieldSize="medium"
              elementID="id20"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Plain text field with label"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Plain text field with help text"
              hasDelete={false}
              fieldSize="medium"
              elementID="id21"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            With delete
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              hasDelete
              fieldSize="medium"
              elementID="id22"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Text field with label"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete
              fieldSize="medium"
              elementID="id23"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              hasDelete
              fieldSize="medium"
              elementID="id24"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Text field help text"
              hasDelete
              fieldSize="medium"
              elementID="id601"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Plain text field with label"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Plain text field with help text"
              hasDelete
              fieldSize="medium"
              elementID="id602"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            Character limit
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              maxLength={10}
              hasDelete={false}
              fieldSize="medium"
              elementID="id25"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              maxLength={10}
              hasDelete
              fieldSize="medium"
              elementID="id26"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Character limit"
              isFormLabelHidden={false}
              placeholderText=""
              maxLength={10}
              hasDelete
              fieldSize="medium"
              elementID="id27"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Max length of 10"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Text field with help text"
              hasDelete
              maxLength={10}
              fieldSize="medium"
              elementID="id28"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            Phone Number
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber4}
              setFormText={updateSingleLinePhoneNumber4}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isPhoneNumber
              hasDelete={false}
              fieldSize="medium"
              elementID="id29"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber5}
              setFormText={updateSingleLinePhoneNumber5}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isPhoneNumber
              hasDelete
              fieldSize="medium"
              elementID="id30"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber6}
              setFormText={updateSingleLinePhoneNumber6}
              formLabel="Enter Phone number"
              isFormLabelHidden={false}
              placeholderText=""
              helpText="Enter your phone number"
              isPhoneNumber
              hasDelete
              fieldSize="medium"
              elementID="id31"
            />
          </Col>
        </Row>
        <div className="h3" style={pad}>Large text field</div>
        <Row>
          <Col sm={2}>
            Plain
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              hasDelete={false}
              fieldSize="large"
              elementID="id32"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Text field with label"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="large"
              elementID="id33"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              hasDelete={false}
              fieldSize="large"
              elementID="id34"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Text field help text"
              hasDelete={false}
              fieldSize="large"
              elementID="id35"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Plain text field with label"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Plain text field with help text"
              hasDelete={false}
              fieldSize="large"
              elementID="id36"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            With delete
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              hasDelete
              fieldSize="large"
              elementID="id37"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Text field with label"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete
              fieldSize="large"
              elementID="id38"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              hasDelete
              fieldSize="large"
              elementID="id39"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Text field help text"
              hasDelete
              fieldSize="large"
              elementID="id40"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Plain text field with label"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Plain text field with help text"
              hasDelete
              fieldSize="large"
              elementID="id41"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            Character limit
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              maxLength={10}
              hasDelete={false}
              fieldSize="medium"
              elementID="id42"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              maxLength={10}
              hasDelete
              fieldSize="large"
              elementID="id43"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Character limit"
              isFormLabelHidden={false}
              placeholderText=""
              maxLength={10}
              hasDelete
              fieldSize="large"
              elementID="id44"
            />
          </Col>
          <Col sm={2}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Max length of 10"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Text field with help text"
              hasDelete
              maxLength={10}
              fieldSize="large"
              elementID="id45"
            />
          </Col>
        </Row>
        <hr className="break" />
        <Row>
          <Col sm={2}>
            Phone Number
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber7}
              setFormText={updateSingleLinePhoneNumber7}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isPhoneNumber
              hasDelete={false}
              fieldSize="large"
              elementID="id46"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber8}
              setFormText={updateSingleLinePhoneNumber8}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isPhoneNumber
              hasDelete
              fieldSize="large"
              elementID="id47"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber9}
              setFormText={updateSingleLinePhoneNumber9}
              formLabel="Enter Phone number"
              isFormLabelHidden={false}
              placeholderText=""
              helpText="Enter your phone number"
              isPhoneNumber
              hasDelete
              fieldSize="large"
              elementID="id48"
            />
          </Col>
        </Row>
      </Container>
      <div className="h2" style={pad}> Multi Line Text Field</div>
      <Container style={pad} no-gutters="true" fluid>
        <div className="h3" style={pad}>Fixed Height</div>
        <Row>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isDynamic={false}
              fieldHeight={100}
              elementID="id49"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="Form label text"
              isFormLabelHidden={false}
              placeholderText=""
              isDynamic={false}
              fieldHeight={100}
              elementID="id50"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              isDynamic={false}
              fieldHeight={100}
              elementID="id51"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Help text"
              isDynamic={false}
              fieldHeight={100}
              elementID="id52"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="Label text"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Help text"
              isDynamic={false}
              fieldHeight={100}
              elementID="id53"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="Set the size to any height!"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Help text"
              isDynamic={false}
              fieldHeight={150}
              elementID="id54"
            />
          </Col>
        </Row>
        <hr className="break" />
        <div className="h3" style={pad}>Expanding Down</div>
        <Row>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isDynamic
              fieldHeight={100}
              elementID="id55"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="Form label text"
              isFormLabelHidden={false}
              placeholderText=""
              isDynamic
              fieldHeight={100}
              elementID="id56"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              isDynamic
              fieldHeight={100}
              elementID="id57"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Help text"
              isDynamic
              fieldHeight={100}
              elementID="id58"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="Label text (max height 500px)"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Help text"
              isDynamic
              fieldHeight={100}
              maxFieldHeight={500}
              elementID="id59"
            />
          </Col>
        </Row>
        <hr className="break" />
        <div className="h3" style={pad}>Expanding Up</div>
        <Row>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              isDynamic
              expandDownward={false}
              fieldHeight={100}
              elementID="id60"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="Form label text"
              isFormLabelHidden={false}
              placeholderText=""
              isDynamic
              expandDownward={false}
              fieldHeight={100}
              elementID="id61"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText="Placeholder text"
              isDynamic
              expandDownward={false}
              fieldHeight={100}
              elementID="id62"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="hidden form label"
              isFormLabelHidden
              placeholderText=""
              helpText="Help text"
              isDynamic
              expandDownward={false}
              fieldHeight={100}
              elementID="id63"
            />
          </Col>
          <Col sm={2}>
            <ADSMultiLineTextField
              formText={multiLineText}
              setFormText={updateMultiLineText}
              formLabel="Label text (max height 500px)"
              isFormLabelHidden={false}
              placeholderText="Placeholder text"
              helpText="Help text"
              isDynamic
              expandDownward={false}
              fieldHeight={100}
              maxFieldHeight={500}
              elementID="id64"
            />
          </Col>
        </Row>
      </Container>
      {/* <div style={pad}>
        <ADSButtonDropdown
          buttonText="Primary Dropdown Button"
          variant="primary"
          height="large"
        />
      </div> */}
      <div className="h2" style={pad}>Text Field with Validation</div>
      <div style={pad}>
        <Row>
          <Col md={4}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Small Validated Text Field (valid: ace) [with icon feedback]"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="validated-text-field-0"
              validationObj={{
                validateValue: 'ace',
                feedbackValue: 'Invalid Text',
                successFeedback: true
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Small Validated Text Field (valid: ace)"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete
              fieldSize="small"
              elementID="validated-text-field-1"
              validationObj={{
                validateValue: 'ace',
                feedbackValue: 'Invalid Text'
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Medium Validated Text Field (valid: ace)"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete
              fieldSize="medium"
              elementID="validated-text-field-2"
              validationObj={{
                validateValue: 'ace',
                feedbackValue: 'Invalid Text'
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ADSSingleLineTextField
              formText={singleLineText}
              setFormText={updateSingleLineText}
              formLabel="Large Validated Text Field (valid: ace)"
              isFormLabelHidden={false}
              hasDelete
              fieldSize="large"
              elementID="validated-text-field-3"
              validationObj={{
                validateValue: 'ace',
                feedbackValue: 'Invalid Text'
              }}
            />
          </Col>
        </Row>
      </div>
      <div className="h2" style={pad}>Single Select Dropdown Boxes</div>
      <Container style={pad} no-gutters="true" fluid>
        <div className="h3" style={pad}>Small</div>
        <Row>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected1}
              formLabel="This is a form label"
              isFormLabelHidden
              helpText=""
              fieldSize="small"
              elementID="dropdownbox_1"
              isDisabled={false}
              dropdownName="name1"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected2}
              formLabel="This is a form label"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="small"
              elementID="dropdownbox_2"
              isDisabled={false}
              dropdownName="name2"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected3}
              formLabel="This is a form label"
              isFormLabelHidden
              helpText="This is help text"
              fieldSize="small"
              elementID="dropdownbox_3"
              isDisabled={false}
              dropdownName="name3"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              defaultSelectedOption={options[2]}
              setSelectedOption={updateDropdownBoxSelected4}
              formLabel="This is a form with a default selection"
              isFormLabelHidden={false}
              helpText="This is help text"
              fieldSize="small"
              elementID="dropdownbox_4"
              isDisabled={false}
              dropdownName="name4"
            />
          </Col>
        </Row>
        <div className="h3" style={pad}>Medium</div>
        <Row>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected5}
              formLabel="This is a form label"
              isFormLabelHidden
              helpText=""
              fieldSize="medium"
              elementID="dropdownbox_5"
              isDisabled={false}
              dropdownName="name5"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected6}
              formLabel="This is a form label"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="medium"
              elementID="dropdownbox_6"
              isDisabled={false}
              dropdownName="name6"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected7}
              formLabel="This is a form label"
              isFormLabelHidden
              helpText="This is help text"
              fieldSize="medium"
              elementID="dropdownbox_7"
              isDisabled={false}
              dropdownName="name7"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              defaultSelectedOption={options[2]}
              setSelectedOption={updateDropdownBoxSelected8}
              formLabel="This is a form with a default selection"
              isFormLabelHidden={false}
              helpText="This is help text"
              fieldSize="medium"
              elementID="dropdownbox_8"
              isDisabled={false}
              dropdownName="name8"
            />
          </Col>
        </Row>
        <div className="h3" style={pad}>Large</div>
        <Row>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected9}
              formLabel="This is a form label"
              isFormLabelHidden
              helpText=""
              fieldSize="large"
              elementID="dropdownbox_9"
              isDisabled={false}
              dropdownName="name9"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected10}
              formLabel="This is a form label"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="large"
              elementID="dropdownbox_10"
              isDisabled={false}
              dropdownName="name10"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              setSelectedOption={updateDropdownBoxSelected11}
              formLabel="This is a form label"
              isFormLabelHidden
              helpText="This is help text"
              fieldSize="large"
              elementID="dropdownbox_11"
              isDisabled={false}
              dropdownName="name11"
            />
          </Col>
          <Col sm={3}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={options}
              defaultSelectedOption={options[2]}
              setSelectedOption={updateDropdownBoxSelected12}
              formLabel="This is a form with a default selection"
              isFormLabelHidden={false}
              helpText="This is help text"
              fieldSize="large"
              elementID="dropdownbox_12"
              isDisabled={false}
              dropdownName="name12"
            />
          </Col>
        </Row>
        <div className="h2" style={pad}>Group Buttons</div>
        <div style={pad}>
          <ADSButtonGroup label="Button Group">
            <ADSGroupButton
              label="GB One"
              groupName="group-button-example"
            />
            <ADSGroupButton
              label="GB Two"
              groupName="group-button-example"
            />
            <ADSGroupButton
              label="GB Three"
              groupName="group-button-example"
            />
          </ADSButtonGroup>
        </div>
        <div style={pad}>
          <ADSButtonGroup label="Icon Button Group">
            <ADSGroupButton
              icon={faEnvelope}
              label="GBI One"
              groupName="icon-group-button-example"
            />
            <ADSGroupButton
              icon={faHeart}
              label="GBI Two"
              groupName="icon-group-button-example"
            />
          </ADSButtonGroup>
        </div>
      </Container>
      <div className="h2" style={pad}>File Upload</div>
      <div style={pad}>
        <ADSFileUpload
          uploadSuccessFunction={uploadFileSuccess}
          deleteSuccessFunction={deleteFileSuccess}
        />
      </div>
      <div className="h2" style={pad}>Dialog</div>

      <DialogGallery />

      <div className="h2" style={pad}>Alphanumeric Dial Pad</div>
      <Container fluid>
        <Row>
          <Col sm={3} style={pad}>
            <ADSSingleLineTextField
              formText={singleLinePhoneNumber1}
              setFormText={updateSingleLinePhoneNumber1}
              formLabel="Phone Number"
              isFormLabelHidden={false}
              placeholderText=""
              isPhoneNumber
              hasDelete
              elementID="id145"
            />
          </Col>
        </Row>
        <Row><br /></Row>
        <Row>
          <Col>Dark Background</Col>
          <Col>No Background</Col>
          <Col>No Background (Blue is set in Dial Pad&apos;s container)</Col>
        </Row>
        <Row>
          <Col>
            <ADSAlphanumericDialPad numPressed={numPressed} background="dark" />
          </Col>
          <Col>
            <ADSAlphanumericDialPad numPressed={numPressed} />
          </Col>
          <Col style={{ backgroundColor: '#073863' }}>
            <ADSAlphanumericDialPad numPressed={numPressed} />
          </Col>
        </Row>
        <Row><br /></Row>
      </Container>
      <div className="h2" style={pad}>Number input box</div>
      <Container fluid>
        <Row>
          <Col sm={3} style={pad}>
            <ADSNumberInput
              changeFunction={numberInputChangeFunction}
              minValue={2}
              maxValue={60}
              stepValue={1}
              defaultValue={35}
            />
          </Col>
        </Row>
      </Container>
      <div className="h2" style={pad}>Navigation Rail/Panel</div>
      {/* ***Removing padding from Container is REQUIRED to prevent whitespace around sidebar*** */}
      <Container style={{
        height: '800px', width: '800px', border: '5px solid black', padding: '0'
      }}
      >
        <ADSNavigationRailPanel
          menuItems={navigationMenuItems}
        />
        <Container>
          <Row>
            <Col>
              contents of the page
            </Col>
          </Row>
        </Container>
      </Container>
      <div className="h2" style={pad}>Data Tables</div>
      <div style={pad}>Due to the customizations to the ADSDatatable please use: &nbsp;
        <a href="/tablepage">/tablepage</a><br />
      </div>
      <div className="h2" style={pad}>Accordion</div>
      <ADSAccordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Section 1</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Section 2</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Accordion Section 3</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </ADSAccordion>
      {/* NOTE: Traversing along the stepper elements is done in the onClick function */}
      <div className="h2" style={pad}>Stepper</div>
      <Container style={{
        height: '500px', width: '1000px', border: '5px solid black', padding: '0'
      }}
      >
        <Row className="mx-1">
          <Col className="mx-auto">
            <ADSStepper stepElements={stepperElements} />
          </Col>
        </Row>
        <Row className="mx-1" style={{ height: '300px' }}>
          <Col>
            Form Content would go here...
            Stepping through the content is done in the ADS Buttons functions.
          </Col>
        </Row>
        <Row className="mx-1">
          <Col>
            <ADSButton buttonText="Previous" onClick={() => prevNextButtonClicked('previous')} />
            <ADSButton buttonText="Next" onClick={() => prevNextButtonClicked('next')} />
          </Col>
        </Row>
      </Container>

      <div className="h2" style={pad}>Arrow Tree</div>
      <ADSTreeView
        treeRef={treeRef}
        treeData={arrowJSON}
        branchClicked={reportTreeData}
      />

      <div className="h2" style={pad}>Tiles</div>
      <div style={pad}>
        <ADSTileGroup
          type="single"
          label="Single Select Tiles"
          displayLabel
          id="test-id"
          group="single-tile-example"
          onChecked={(value) => console.log(value)}
          onUnChecked={(value) => console.log(value)}
          tiles={[
            {
              value: 'IPCTS', textContent: 'IPCTS with ASR', icons: [faComputer]
            },
            {
              value: 'IP Relay with ASR', textContent: 'IP Relay with ASR', icons: [faComputer]
            },
            {
              value: 'VRS', textContent: 'VRS', icons: [faComputer]
            },
            {
              value: 'Disabled', textContent: 'Custom', icons: [faComputer], disabled: true
            }
          ]}
        />
      </div>
      <div style={pad}>
        <ADSTileGroup
          type="multi"
          label="Multi Select Tiles"
          displayLabel
          id="test-id-2"
          group="multi-tile-example"
          onChecked={(value) => console.log(value)}
          onUnChecked={(value) => console.log(value)}
          tiles={[
            {
              value: 'IPCTS', textContent: 'IPCTS with ASR', icons: [faComputer]
            },
            {
              value: 'IP Relay with ASR', textContent: 'IP Relay with ASR', icons: [faComputer]
            },
            {
              value: 'VRS', textContent: 'VRS', icons: [faComputer]
            },
            {
              value: 'Disabled', textContent: 'Custom', icons: [faComputer], disabled: true
            }
          ]}
        />
      </div>
      <div className="h2" style={pad}>Sidebar Menu</div>
      <ADSSidebarMenu
        menuItems={sidebarMenuItems}
      />
      <div className="h2" style={pad}>Links</div>
      <div style={pad}>
        <div>
          This is an&nbsp;
          <ADSLink
            url="https://www.google.com"
            linkText="external link"
            fontType="body1"
            isExternal
            isNavigational
          />
          &nbsp;that goes to google.com.
        </div>
        <div>
          This is an&nbsp;
          <ADSLink
            url="/login"
            linkText="internal link"
            fontType="body1"
            isExternal={false}
            isNavigational
          />
          &nbsp;that goes back to the login page.
        </div>

        <div>
          This is a&nbsp;
          <ADSLink
            url=""
            linkText="link"
            fontType="body1"
            isExternal={false}
            isNavigational={false}
            onClickFunction={linkFunction}
          />
          &nbsp;that does not navigate.
        </div>
      </div>
      {/* <div style={pad}>
        <Container
          fluid
          className="vrs-container"
        >
          <Row className="vrs-container">
            <Col className="self-view-box">
              <ADSVideoComponent
                videoType="self-view"
                videoRef=''
              />
            </Col>
            <Col className="remote-view-box">
              <ADSVideoComponent
                videoType="remote-view-video"
                videoRef=''
              />
            </Col>
          </Row>
        </Container>
      </div> */}
    </main>
  );
}
