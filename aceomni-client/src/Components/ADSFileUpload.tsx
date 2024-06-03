import React, {
  useState, useCallback, useMemo, useEffect
} from 'react';
import axios from 'axios';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ADSButton from './ADSButton';
import ADSIconButton from './ADSIconButton';
import ADSProgressIndicator from './ADSProgressIndicator';
import './ADSFileUpload.css';

/**
 * Creates a File Upload Form
 *
 * @description File Upload component that handles multiple files at once
 * and will accept various file types
 *
 * @returns File Upload component
 *
 */

function FileUploadItem(props: {
  id: string;
  item: any,
  error: boolean,
  progress: number,
  deleteCancelFile: () => void,
  deleteId?: string;
}) {
  const {
    id,
    item,
    error,
    progress,
    deleteCancelFile,
    deleteId
  } = props;

  const updateProgress = useMemo(() => progress, [progress]);

  return (
    <div className="file-upload-item" id={id} data-delete-id={deleteId}>
      <div className={error ? 'file-upload-file-info upload-invalid' : 'file-upload-file-info'}>
        <div className="file-upload-text">
          {item}
        </div>
        <div className="file-upload-button">
          <ADSIconButton
            ariaLabel="Cancel Upload"
            disabled={false}
            icon={faTimes}
            height="small"
            onClick={deleteCancelFile}
            variant="standard"
          />
        </div>
      </div>
      <div className="upload-progress-error">
        {error
          ? (
            <span id="upload-error-span" className="subtitle2">File cannot be added.</span>
          ) : (
            <span id="upload-progress-span" style={(progress === undefined || progress >= 100) ? { display: 'none' } : { display: 'initial' }}>
              <ADSProgressIndicator
                ariaLabel="Determinate Progress"
                color="blue"
                isDeterminate
                progress={updateProgress}
                height="progress-small"
              />
            </span>
          )}
      </div>
    </div>
  );
}

FileUploadItem.defaultProps = {
  deleteId: ''
};

function ADSFileUpload(props: {
  width?: number,
  allowMultiple?: boolean,
  buttonText?: string,
  uploadSuccessFunction: any,
  deleteSuccessFunction: any
}) {
  const {
    width,
    allowMultiple,
    buttonText,
    uploadSuccessFunction,
    deleteSuccessFunction
  } = props;

  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null);
  const [uploadedItems, setUploadedItems] = useState([] as any);
  const [cancel, setCancel] = useState(false);
  const triggerCancel = useMemo(() => cancel, [cancel]);
  const url = `${process.env.REACT_APP_LOCATION}/api/files`;

  // helper to create form for file upload
  const addFile = async (file: any) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    return formData;
  };

  // handle file to be uploaded
  async function handleUpload(file: any) {
    const formData = await addFile(file);
    const newFile = {
      id: null,
      name: file.name,
      progress: 0,
      error: false,
      // id: null,
      filename: 'error'
    };

    setTimeout(() => {
      setUploadedItems((prev: any) => [...prev, newFile]);
    }, 250);

    // axios logic
    const controller = new AbortController();
    const config = {
      // signal to cancel upload
      signal: controller.signal,
      // upload progress event from axios
      onUploadProgress: (progressEvent: any) => {
        // pause upload progress for 250ms
        setTimeout(() => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          newFile.progress = percentCompleted;
          console.log(`🌐 Received ${percentCompleted}%`);
          if (triggerCancel) { // WIP
            controller.abort();
            console.log('controller.abort()');
          }
          setUploadedItems((prev: any) => {
            prev.map((item: any) => {
              if (item.progress >= percentCompleted) {
                return null;
              }
              return [...prev];
            });
            return [...prev];
          });
        }, 250);
      }
    };

    axios.post(`${url}/upload`, formData, config)
      .then((response) => {
        console.log('🌐 Uploading File..', response);
        newFile.id = response.data.id;
        newFile.filename = response.data.filename;
        uploadSuccessFunction(newFile);
      })
      .catch((error) => {
        console.log('🌐 Error', error);
        newFile.error = true;
        setUploadedItems((prev: any) => {
          prev.map((item: any) => {
            if (!item.error) {
              return null;
            }
            return [...prev];
          });
          return [...prev];
        });
        if (error.name === 'AbortError') { // WIP
          console.log('🌐 Successfully Aborted Upload', error);
        }
      });
  }

  // handle when 'x' is clicked on file object
  const handleDeleteCancel = (id: any, progress: any) => {
    const element = document.getElementById(`file-upload-item-${id}`);
    const deleteId = element?.getAttribute('data-delete-id');
    // cancel upload
    if (progress < 100 && deleteId === null) {
      console.log('🌐 Cancel Upload -- WIP');
      setCancel(true);
      // remove error file
    } else if (deleteId === 'error') {
      const newItems = uploadedItems.filter((_item: any, index: any) => (id !== index));
      setUploadedItems(() => newItems);
      // delete from db
    } else if (deleteId !== null) {
      console.log('🌐 Delete File', deleteId);
      axios.delete(`${url}/delete/${deleteId}`)
        .then((response) => {
          console.log('🌐 Deleting file ..', response.data.message);
          // remove deleted file from DOM
          const newItems = uploadedItems.filter((item: any) => item.filename !== deleteId);
          deleteSuccessFunction(deleteId);
          setUploadedItems(() => newItems);
        })
        .catch((error) => {
          console.log('🌐 Error', error);
        });
    } else {
      console.log('🌐 File cannot be removed');
    }
  };

  // activate file select browser
  const handleClick = useCallback(() => {
    if (!allowMultiple && uploadedItems.length > 0) {
      return;
    }
    if (typeof hiddenFileInput !== 'undefined') {
      hiddenFileInput?.current?.click();
    }
    // remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [allowMultiple, uploadedItems]);

  // handle when file is selected
  const handleChange = async (event: any) => {
    // event.preventDefault();
    const fileList = await event.target.files;
    Array.from(fileList).forEach(async (file: any) => {
      await handleUpload(file);
    });
  };

  // get items from db
  const getFiles = async () => {
    try {
      const response = await axios.get(`${url}/all`);
      const dbFiles = await response.data.files;
      setUploadedItems(() => dbFiles);
    } catch (error) {
      console.log('🌐 getFile error', error);
    }
  };

  useEffect(() => {
    if (buttonText === ADSFileUpload.defaultProps.buttonText) {
      getFiles();
    }
    // wont stop re-rendering unless empty dependancy array is present
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="file-upload-container" style={{ width: `${width}%` }}>
      <ADSButton
        onClick={handleClick}
        buttonText={buttonText}
      />
      <form
        id="file-upload-form"
        encType="multipart/form-data"
      >
        <input
          type="file"
          onChange={(e) => handleChange(e)}
          name="file"
          multiple={allowMultiple}
          ref={hiddenFileInput}
          style={{ display: 'none' }}
        />
      </form>
      <div className="uploaded-items">
        {uploadedItems.map((file: any, index: any) => (
          <FileUploadItem
            key={file.filename ? `${file.filename}-${index}` : index}
            item={file.name}
            id={`file-upload-item-${index}`}
            progress={file.progress}
            error={file.error}
            deleteId={file.filename ? file.filename : `error-item-${index}`}
            deleteCancelFile={() => handleDeleteCancel(index, file.progress)}
          />
        ))}
      </div>
    </div>
  );
}

ADSFileUpload.defaultProps = {
  width: 50,
  allowMultiple: true,
  buttonText: 'Add File(s)'
};

export default ADSFileUpload;
