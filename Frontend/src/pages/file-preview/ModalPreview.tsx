import ModalFull from '../common/Modal/ModalFull';
import { useEffect, useState, useRef } from 'react';
import { Text, Input, Loader } from '@mantine/core';
import { THEME } from '../../appTheme';
import GenericBtn from '../common/components/button';
import { ITableDataProps } from '../common/Table/types';
import { readBinaryFile } from '@tauri-apps/api/fs';

interface ModalPreviewProps {
  open: boolean;
  close: () => void;
  data: ITableDataProps;
  image_dir: string | undefined;
}

const AnswerCard = ({
  answer,
  color,
  number,
  isEditing,
}: {
  answer: string;
  color: string;
  number: number;
  isEditing: boolean;
}) => {
  const [editAnswer, setEditAnswer] = useState(answer);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditAnswer(e.target.value);
  };

  return (
    <div style={{ display: 'inline-block', width: '10%', margin: '5px' }}>
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
              value={editAnswer}
              onChange={handleChange}
              style={{ width: '35px' }}
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
  image_dir,
}) => {
  const [page, setPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [draggedY, setDraggedY] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedAnswers, setEditedAnswers] = useState<string[]>([]);

  const answersPerPage = !isEditing ? 56 : 48;
  const imageRef = useRef<HTMLImageElement>(null);
  const [result, setResult] = useState<{ answer: string; color: string }[]>([]);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (image_dir && !imageSrc && data.file_name) {
      const image_path = `${image_dir
        .trim()
        .replace(/\\/g, '/')}/${data.file_name.trim()}`;
      readImageFile(image_path);
      console.log(image_path);
    }
  }, [image_dir, data.file_name]); // Update the dependency array

  const readImageFile = async (path: string) => {
    try {
      const imageBinary = await readBinaryFile(path);
      const blob = new Blob([imageBinary], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(blob);
      setImageSrc(blobUrl);
    } catch (error) {
      console.error('Error reading image file:', error);
    }
  };

  useEffect(() => {
    const markingScheme: string[] = generateMarkingScheme();
    const studentAnswers: string[] = generateStudentAnswers();
    const comparisonResult = compareAnswers(studentAnswers, markingScheme);
    setResult(comparisonResult);
  }, []);

  const generateMarkingScheme = (): string[] => {
    const markingScheme: string[] = [];
    for (let i: number = 0; i < 100; i++) {
      markingScheme.push(generateRandomAnswer());
    }
    return markingScheme;
  };

  const generateRandomAnswer = (): string => {
    const answers: string[] = ['A', 'B', 'C', 'D', 'E'];
    const randomIndex: number = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
  };

  const generateStudentAnswers = (): string[] => {
    const studentAnswers: string[] = [];
    for (let i: number = 0; i < 100; i++) {
      studentAnswers.push(generateRandomAnswer());
    }
    return studentAnswers;
  };

  const compareAnswers = (
    studentAnswers: string[],
    markingScheme: string[]
  ): { answer: string; color: string }[] => {
    const result: { answer: string; color: string }[] = [];
    for (let i: number = 0; i < studentAnswers.length; i++) {
      if (studentAnswers[i] === markingScheme[i]) {
        result.push({ answer: studentAnswers[i], color: '#006D32' });
      } else {
        result.push({ answer: studentAnswers[i], color: 'red' });
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
    setZoom((prevZoom) => prevZoom + 10); // Increase zoom by 10%
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(10, prevZoom - 10)); // Decrease zoom by 10%, but not less than 10%
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
    // If switching to edit mode, store the original answers
    if (!isEditing) {
      setEditedAnswers([...slicedResult.map((ans) => ans.answer)]);
    }
  };

  const handleEditSave = (index: number, newAnswer: string) => {
    const updatedAnswers = [...editedAnswers];
    updatedAnswers[index] = newAnswer;
    setEditedAnswers(updatedAnswers);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedAnswers([]);
  };

  const handleUpdate = () => {
    // Update the answers in the result
    const updatedResult = [...result];
    for (let i = 0; i < editedAnswers.length; i++) {
      updatedResult[(page - 1) * answersPerPage + i].answer = editedAnswers[i];
    }
    setResult(updatedResult);
    // Exit edit mode
    setIsEditing(false);
  };

  return (
    <>
      <ModalFull opened={open} close={close}>
        <div
          style={{ display: 'flex', gap: '5rem', padding: '2rem 2rem 0 4rem' }}
        >
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
                  transform: `scale(${zoom / 100})`,
                  transition: 'transform 0.3s ease-in-out',
                  userSelect: 'none',
                }}
                alt="Scan sheet"
                onLoad={() => console.log('Image loaded successfully')}
                onWheel={(e) => {
                  if (e.deltaY < 0) {
                    handleZoomIn();
                  } else {
                    handleZoomOut();
                  }
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <button onClick={handleZoomIn}>+</button>
                <button onClick={handleZoomOut}>-</button>
                <button onClick={handleReset}>
                  <span role="img" aria-label="Reset Zoom">
                    ↻
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                width: '23rem',
                textAlign: 'center',
              }}
            >
              <Loader size="40" color="#fff" type="bars" />
            </div>
          )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: '4rem',
                fontSize: '1.2rem',
              }}
            >
              <div style={{ display: 'flex', gap: '5px' }}>
                <Text>Index number:</Text>
                <Text color={THEME.colors.text.primary}>
                  {data['index number']}
                </Text>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Text>Score:</Text>
                <Text color={THEME.colors.text.primary}>{data.score}</Text>
              </div>
            </div>
            <div style={{ height: '25rem' }}>
              {slicedResult.map((answer, index) => (
                <AnswerCard
                  key={index}
                  answer={answer.answer}
                  color={answer.color}
                  number={index + 1 + (page - 1) * answersPerPage}
                  isEditing={isEditing}
                />
              ))}
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'flex-end',
                  padding: '0 4rem 3rem 0',
                }}
              >
                <GenericBtn
                  title={isEditing ? 'Update' : 'Edit'}
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
