import ModalFull from '../common/Modal/ModalFull';
import { useEffect, useState, useRef, useContext } from 'react';
import { Text, Input, Loader } from '@mantine/core';
import { THEME } from '../../appTheme';
import GenericBtn from '../common/components/button';
import { ITableDataProps } from '../common/Table/types';
import { BaseDirectory, readBinaryFile, writeFile } from '@tauri-apps/api/fs';
import { CiEdit } from "react-icons/ci";
import { appContext } from '../../utils/Context';
import { MarkingSchemeType } from '../common/components/types';
import { generateMarkingScheme } from '../../utils/helper';


interface ModalPreviewProps {
  open: boolean;
  close: () => void;
  data: ITableDataProps;
  updateData: (updatedData: ITableDataProps[]) => void;
  image_dir: string | undefined;
  marking_scheme: MarkingSchemeType | undefined;
  csv_file: string | undefined;
}

const AnswerCard = ({
  answer,
  color,
  number,
  isEditing,
  onChange,
}: {
  answer: string;
  color: string;
  number: number;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div style={{ display: 'inline-block', width: '11%', margin: '5px' }}>
      <div
        style={{
          backgroundColor: color,
          padding: '10px',
          textAlign: 'center',
          borderRadius: '5px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '0.9rem',
            color: `${THEME.colors.background.primary}`,
          }}
        >{`${number}. `}</span>
        {isEditing ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Input
              value={answer}
              onChange={onChange}
              style={{ width: '40px' }}
            />
          </div>
        ) : (
          answer
        )}
      </div>
    </div>
  );
};

const ModalPreview: React.FC<ModalPreviewProps> = ({
  open,
  close,
  data,
  updateData,
  image_dir,
  marking_scheme,
  csv_file
}) => {
  const [page, setPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [draggedY, setDraggedY] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedAnswers, setEditedAnswers] = useState<string[]>([]);
  const [isIndexEditing, setIsIndexEditing] = useState<boolean>(false);
  const [indexNumber, setIndexNumber] = useState<string>(data['index number']);
  const [score, setScore] = useState<number>(data.score);

  const { responseData, setResponseData } = useContext(appContext);

  const answersPerPage = !isEditing ? 49 : 42;
  const imageRef = useRef<HTMLImageElement>(null);
  const [result, setResult] = useState<{ answer: string; color: string }[]>([]);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (image_dir && !imageSrc && data.file_name) {
      const image_path = `VisioMark\\exam_sheets\\${image_dir.trim()}\\${data.file_name.trim()}`;
      readImageFile(image_path);
      console.log(image_path);
    }
  }, [image_dir, data.file_name]);

  const readImageFile = async (path: string) => {
    try {
      const imageBinary = await readBinaryFile(path, {
        dir: BaseDirectory.Document,
      });
      const blob = new Blob([imageBinary], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(blob);
      setImageSrc(blobUrl);
    } catch (error) {
      console.error('Error reading image file:', error);
    }
  };

  useEffect(() => {

    const markingScheme: string[] = generateMarkingScheme(marking_scheme);
    // console.log('Marking Scheme');
    // console.log(markingScheme);
    const studentAnswers: string[] = data.predictions.split(',').map(ans => ans.trim());
    // console.log('Student Answers');
    // console.log(studentAnswers);
    const comparisonResult = compareAnswers(studentAnswers, markingScheme);
    // console.log(comparisonResult)
    setResult(comparisonResult);
  
  }, [data.predictions, marking_scheme]);


  const compareAnswers = (
    studentAnswers: string[],
    markingScheme: string[]
  ): { answer: string; color: string }[] => {
    const result: { answer: string; color: string }[] = [];
    for (let i: number = 0; i < studentAnswers.length; i++) {
      const studentAnswer = studentAnswers[i];
      const correctAnswer = markingScheme[i];
      if (studentAnswer == correctAnswer) {
        result.push({ answer: studentAnswer, color: '#006D32' });
      } else {
        result.push({ answer: studentAnswer, color: 'red' });
      }
    }
    return result;
  };

  const slicedResult = result.slice(
    (page - 1) * answersPerPage,
    page * answersPerPage
  );

  const totalPages = Math.ceil(result.length / answersPerPage);

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom + 10);
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(100, prevZoom - 10));
  };

  const handleReset = () => {
    setZoom(100);
    setStartY(0);
    setDraggedY(0);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (isDragging) {
      const deltaY = e.clientY - startY;
      setDraggedY(deltaY);
      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(${draggedY}px) scale(${zoom / 100})`;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartY(0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setStartY(0);
  };

  const handleArrowUp = () => {
    setDraggedY((prevDraggedY) => prevDraggedY - 20);
    if (imageRef.current) {
      imageRef.current.style.transform = `translateY(${draggedY - 20}px) scale(${zoom / 100})`;
    }
  };

  const handleArrowDown = () => {
    setDraggedY((prevDraggedY) => prevDraggedY + 20);
    if (imageRef.current) {
      imageRef.current.style.transform = `translateY(${draggedY + 20}px) scale(${zoom / 100})`;
    }
  };

  const nextStep = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevStep = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedAnswers([...slicedResult.map((ans) => ans.answer)]);
    }
  };

  const handleEditChange = (index: number, newAnswer: string) => {
    const updatedAnswers = [...editedAnswers];
    updatedAnswers[index] = newAnswer;
    setEditedAnswers(updatedAnswers);
  };

  
  const calculateNewScore = (updatedAnswers: string[]): number => {
    let score = 0;
    const markingScheme: string[] = generateMarkingScheme(marking_scheme);
    for (let i = 0; i < updatedAnswers.length; i++) {
      if (updatedAnswers[i].toLowerCase() === markingScheme[i].toLowerCase()) {
        score += 1;
      }
    }
    return score;
  };
  
  const handleUpdate = async () => {
    const updatedResult = [...result];
    for (let i = 0; i < editedAnswers.length; i++) {
      updatedResult[(page - 1) * answersPerPage + i] = {
        answer: editedAnswers[i],
        color:
          editedAnswers[i].toLowerCase() ===
          generateMarkingScheme(marking_scheme)[(page - 1) * answersPerPage + i].toLowerCase()
            ? '#006D32'
            : 'red',
      };
    }
    console.log('Updated Result:', updatedResult);
  
    setResult(updatedResult);
  
    const updatedPredictions = updatedResult.map((res) => res.answer).join(', ');
    const newScore = calculateNewScore(updatedResult.map((res) => res.answer));
    
    console.log('New Score:', newScore);
  
    const updatedData = responseData.map((item) =>
      item['index number'] === data['index number']
        ? { ...item, predictions: updatedPredictions, score: newScore }
        : item
    );
    setScore(newScore);
    updateData(updatedData);

    console.log('Updated Data:', updatedData);
  
    // // Update local storage
    // localStorage.setItem('responseData', JSON.stringify(updatedData));
    setResponseData(updatedData);
  
    const csvData = updatedData
      .map((row) =>
        Object.values(row)
          .map((val) => `${val}`)
          .join(',')
      )
      .join('\n');
    console.log('CSV Data:', csvData);
  
    try {
      await writeFile(
        { contents: csvData, path: `VisioMark\\result\\${csv_file}` },
        { dir: BaseDirectory.Document }
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error writing to CSV file:', error);
      // Handle error
    }
  };
  

  
  const handleIndexChange = async () => {
    const updatedData = responseData.map((item) =>
      item['index number'] === data['index number']
        ? { ...item, 'index number': indexNumber }
        : item
    );

    updateData(updatedData);

    // Update local storage
    // localStorage.setItem('responseData', JSON.stringify(updatedData));
    setResponseData(updatedData);

    const csvData = updatedData
      .map((row) =>
        Object.values(row)
          .map((val) => `${val}`)
          .join(',')
      )
      .join('\n');

    await writeFile(
      { contents: csvData, path: `VisioMark\\result\\${csv_file}` },
      { dir: BaseDirectory.Document }
    );

    setIsIndexEditing(false);
  };


  return (
    <>
      <ModalFull opened={open} close={close}>
        <div style={{ display: 'flex', gap: '5rem', padding: '2rem 2rem 0 4rem' }}>
          <div
            style={{
              padding: '2rem',
              background: THEME.colors.background.jet,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {imageSrc ? (
              <>
                <img
                  ref={imageRef}
                  src={imageSrc}
                  style={{
                    width: '23rem',
                    transform: `translateY(${draggedY}px) scale(${zoom / 100})`,
                    transition: 'transform 0.3s ease-in-out',
                    userSelect: 'none',
                  }}
                  alt="Student Answer Sheet"
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    style={{
                      backgroundColor: `${THEME.colors.background.jet}`,
                      color:'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={handleZoomIn}
                  >
                    +
                  </button>
                  <button
                    style={{
                      backgroundColor: `${THEME.colors.background.jet}`,
                      color:'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={handleZoomOut}
                  >
                    -
                  </button>
                  <button
                    style={{
                      backgroundColor: `${THEME.colors.background.jet}`,
                      color:'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={handleReset}
                  >
                    <span role="img" aria-label="Reset Zoom">
                      ↻
                    </span>
                  </button>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '5%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    style={{
                      backgroundColor: `${THEME.colors.background.jet}`,
                      color:'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={handleArrowUp}
                  >
                    ↑
                  </button>
                  <button
                    style={{
                      backgroundColor: `${THEME.colors.background.jet}`,
                      color:'white',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={handleArrowDown}
                  >
                    ↓
                  </button>
                </div>
              </>
            ) : (
              <div style={{ width: '23rem', textAlign: 'center' }}>
                <Loader size="40" color="#fff" type="bars" />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '4rem', fontSize: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Text>Index number:</Text>
                {isIndexEditing ? (
                  <Input
                    value={indexNumber}
                    onChange={(e) => setIndexNumber(e.target.value)}
                    onBlur={handleIndexChange}
                    style={{ width: '100px' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} 
                  onClick={() => setIsIndexEditing(true)}>
                    <Text color={THEME.colors.text.primary}>{indexNumber}</Text>
                   <CiEdit />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Text>Score:</Text>
                <Text color={THEME.colors.text.primary}>{score}</Text>
              </div>
            </div>
            <div style={{ height: '25rem' }}>
              {slicedResult.map((answer, index) => (
                <AnswerCard
                  key={index}
                  answer={isEditing ? editedAnswers[index] : answer.answer}
                  color={answer.color}
                  number={index + 1 + (page - 1) * answersPerPage}
                  isEditing={isEditing}
                  onChange={(e) => handleEditChange(index, e.target.value)}
                />
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', padding: '0 4rem 3rem 0' }}>
                {isEditing && (
                  <GenericBtn
                    title="Update"
                    type="button"
                    onClick={handleUpdate}
                    sx={{
                      fontSize: '0.8rem',
                      borderRadius: '20px',
                      padding: '0 3rem',
                      color: `${THEME.colors.background.jet}`,
                      background: '#fff',
                      '&:hover': {
                        background: THEME.colors.text.primary,
                      },
                    }}
                  />
                )}
                <GenericBtn
                  title={isEditing ? 'Cancel' : 'Edit'}
                  type="button"
                  onClick={handleEdit}
                  sx={{
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    padding: '0 3rem',
                    color: `${THEME.colors.background.jet}`,
                    background: '#fff',
                    '&:hover': {
                      background: THEME.colors.text.primary,
                    },
                  }}
                />
                <GenericBtn
                  title="Back"
                  type="button"
                  disabled={page === 1}
                  onClick={prevStep}
                  sx={{
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    padding: '0 3rem',
                    color: `${THEME.colors.background.jet}`,
                    background: '#fff',
                    '&:hover': {
                      background: THEME.colors.text.primary,
                    },
                    '&:disabled': {
                      background: THEME.colors.background.jet,
                      color: '#fff',
                    },
                  }}
                />
                <GenericBtn
                  title="Next"
                  type="button"
                  disabled={page === totalPages}
                  onClick={nextStep}
                  sx={{
                    fontSize: '0.8rem',
                    borderRadius: '20px',
                    padding: '0 3rem',
                    color: `${THEME.colors.background.jet}`,
                    background: '#fff',
                    '&:hover': {
                      background: THEME.colors.text.primary,
                    },
                    '&:disabled': {
                      background: THEME.colors.background.jet,
                      color: '#fff',
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </ModalFull>
    </>
  );
};

export default ModalPreview;
