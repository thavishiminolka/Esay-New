
// const Exam = require('../models/examModel');
// const path = require('path');
// const fs = require('fs');

// exports.createExam = async (req, res) => {
//   try {
//     console.log('Received POST request to /api/exams');
//     console.log('Request body:', req.body);
//     console.log('Request files:', req.files);

//     if (!req.body.examData) {
//       throw new Error('examData is required');
//     }
//     if (typeof req.body.examData !== 'string') {
//       throw new Error('examData must be a string');
//     }

//     let examData;
//     try {
//       examData = JSON.parse(req.body.examData);
//     } catch (parseError) {
//       throw new Error(`Invalid examData format: ${parseError.message}`);
//     }

//     // Validate required fields
//     if (!examData.language) throw new Error('Language is required');
//     if (!examData.topic) throw new Error('Topic is required');
//     if (!examData.duration) throw new Error('Duration is required');
//     if (examData.readingTimeMinutes && (isNaN(parseInt(examData.readingTimeMinutes)) || parseInt(examData.readingTimeMinutes) < 0)) {
//       throw new Error('Reading section time must be a non-negative number');
//     }
//     if (examData.listeningTimeMinutes && (isNaN(parseInt(examData.listeningTimeMinutes)) || parseInt(examData.listeningTimeMinutes) < 0)) {
//       throw new Error('Listening section time must be a non-negative number');
//     }
//     if (!examData.questions || !Array.isArray(examData.questions) || examData.questions.length === 0) {
//       throw new Error('At least one question is required');
//     }

//     // Validate questions
//     examData.questions.forEach((question, index) => {
//       if (!question.questionNumber) throw new Error(`Question ${index + 1}: Question number is required`);
//       if (!question.type) throw new Error(`Question ${index + 1}: Type is required`);
//       if (question.type === 'reading' && !question.questionPhoto && !question.questionText) {
//         throw new Error(`Question ${index + 1}: Either question text or photo is required for reading questions`);
//       }
//       if (question.type === 'listening' && !req.files?.[`audio-${index}`]) {
//         throw new Error(`Question ${index + 1}: Audio file is required for listening questions`);
//       }
//       if (!question.answers || question.answers.length !== 4) {
//         throw new Error(`Question ${index + 1}: Exactly four answers are required`);
//       }
//       question.answers.forEach((answer, ansIndex) => {
//         if (!answer.text && !answer.photo) {
//           throw new Error(`Question ${index + 1}, Answer ${ansIndex + 1}: Either text or photo is required`);
//         }
//       });
//       if (!question.answers.some(answer => answer.isCorrect)) {
//         throw new Error(`Question ${index + 1}: At least one answer must be marked as correct`);
//       }
//     });

//     // Handle exam photo
//     if (req.files && req.files.photo) {
//       examData.photo = `/uploads/${req.files.photo[0].filename}`;
//       examData.photoFileName = req.files.photo[0].originalname;
//       console.log(`Photo saved: /uploads/${req.files.photo[0].filename}`);
//     }

//     // Handle question-related files
//     if (req.files) {
//       const audioFiles = Object.keys(req.files).filter(key => key.startsWith('audio-'));
//       const questionPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('questionPhoto-'));
//       const answerPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('answerPhoto-'));

//       audioFiles.forEach(audioKey => {
//         const index = parseInt(audioKey.split('-')[1]);
//         if (examData.questions[index]) {
//           examData.questions[index].audio = `/uploads/${req.files[audioKey][0].filename}`;
//           console.log(`Audio file saved for question ${index}: /uploads/${req.files[audioKey][0].filename}`);
//         } else {
//           console.warn(`No question found at index ${index} for audio file ${audioKey}`);
//         }
//       });

//       questionPhotoFiles.forEach(photoKey => {
//         const index = parseInt(photoKey.split('-')[1]);
//         if (examData.questions[index]) {
//           examData.questions[index].questionPhoto = `/uploads/${req.files[photoKey][0].filename}`;
//           console.log(`Question photo saved for question ${index}: /uploads/${req.files[photoKey][0].filename}`);
//         } else {
//           console.warn(`No question found at index ${index} for question photo ${photoKey}`);
//         }
//       });

//       answerPhotoFiles.forEach(photoKey => {
//         const [_, qIndex, aIndex] = photoKey.split('-').map((part, idx) => idx > 0 ? parseInt(part) : part);
//         if (examData.questions[qIndex] && examData.questions[qIndex].answers[aIndex]) {
//           examData.questions[qIndex].answers[aIndex].photo = `/uploads/${req.files[photoKey][0].filename}`;
//           console.log(`Answer photo saved for question ${qIndex}, answer ${aIndex}: /uploads/${req.files[photoKey][0].filename}`);
//         } else {
//           console.warn(`No answer found at question ${qIndex}, answer ${aIndex} for answer photo ${photoKey}`);
//         }
//       });
//     }

//     const newExam = new Exam(examData);
//     const savedExam = await newExam.save();
//     console.log('Exam saved to MongoDB:', savedExam);
//     res.status(201).json(savedExam);
//   } catch (error) {
//     if (req.files) {
//       Object.values(req.files).forEach(fileArray => {
//         fileArray.forEach(file => {
//           fs.unlink(file.path, (err) => {
//             if (err) console.error('Error deleting uploaded file:', err);
//           });
//         });
//       });
//     }
//     console.error('Error in createExam:', error);
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       res.status(400).json({ message: 'Validation failed', errors });
//     } else {
//       res.status(400).json({ message: error.message || 'Failed to create exam' });
//     }
//   }
// };

// exports.getAllExams = async (req, res) => {
//   try {
//     const exams = await Exam.find();
//     res.status(200).json(exams);
//   } catch (error) {
//     console.error('Error in getAllExams:', error);
//     res.status(500).json({ message: 'Failed to retrieve exams', error: error.message });
//   }
// };

// exports.getExamById = async (req, res) => {
//   try {
//     const exam = await Exam.findById(req.params.id);
//     if (!exam) {
//       return res.status(404).json({ message: 'Exam not found' });
//     }
//     res.status(200).json(exam);
//   } catch (error) {
//     console.error('Error in getExamById:', error);
//     res.status(500).json({ message: 'Failed to retrieve exam', error: error.message });
//   }
// };

// exports.getExamPhoto = async (req, res) => {
//   try {
//     const exam = await Exam.findById(req.params.id);
//     if (!exam || !exam.photo) {
//       return res.status(404).json({ message: 'Photo not found' });
//     }
//     const photoPath = path.join(__dirname, '..', 'public', exam.photo);
//     res.sendFile(photoPath);
//   } catch (error) {
//     console.error('Error in getExamPhoto:', error);
//     res.status(500).json({ message: 'Failed to retrieve photo', error: error.message });
//   }
// };

// exports.getQuestionAudio = async (req, res) => {
//   try {
//     const exam = await Exam.findById(req.params.examId);
//     if (!exam) {
//       return res.status(404).json({ message: 'Exam not found' });
//     }
//     const questionIndex = parseInt(req.params.questionId) - 1;
//     const question = exam.questions[questionIndex];
//     if (!question || !question.audio) {
//       return res.status(404).json({ message: 'Audio not found for this question' });
//     }
//     const audioPath = path.join(__dirname, '..', 'public', question.audio);
//     res.sendFile(audioPath);
//   } catch (error) {
//     console.error('Error in getQuestionAudio:', error);
//     res.status(500).json({ message: 'Failed to retrieve audio', error: error.message });
//   }
// };

// exports.updateExam = async (req, res) => {
//   try {
//     let examData;
//     if (req.body.examData) {
//       examData = JSON.parse(req.body.examData);
//     }

//     // Validate questions
//     if (examData.questions) {
//       examData.questions.forEach((question, index) => {
//         if (!question.questionNumber) throw new Error(`Question ${index + 1}: Question number is required`);
//         if (!question.type) throw new Error(`Question ${index + 1}: Type is required`);
//         if (question.type === 'reading' && !question.questionPhoto && !question.questionText) {
//           throw new Error(`Question ${index + 1}: Either question text or photo is required for reading questions`);
//         }
//         if (question.type === 'listening' && !req.files?.[`audio-${index}`] && !question.audio) {
//           throw new Error(`Question ${index + 1}: Audio file is required for listening questions`);
//         }
//         if (!question.answers || question.answers.length !== 4) {
//           throw new Error(`Question ${index + 1}: Exactly four answers are required`);
//         }
//         question.answers.forEach((answer, ansIndex) => {
//           if (!answer.text && !answer.photo) {
//             throw new Error(`Question ${index + 1}, Answer ${ansIndex + 1}: Either text or photo is required`);
//           }
//         });
//         if (!question.answers.some(answer => answer.isCorrect)) {
//           throw new Error(`Question ${index + 1}: At least one answer must be marked as correct`);
//         }
//       });
//     }

//     // Validate section times
//     if (examData.readingTimeMinutes && (isNaN(parseInt(examData.readingTimeMinutes)) || parseInt(examData.readingTimeMinutes) < 0)) {
//       throw new Error('Reading section time must be a non-negative number');
//     }
//     if (examData.listeningTimeMinutes && (isNaN(parseInt(examData.listeningTimeMinutes)) || parseInt(examData.listeningTimeMinutes) < 0)) {
//       throw new Error('Listening section time must be a non-negative number');
//     }

//     // Handle exam photo
//     if (req.files && req.files.photo) {
//       examData.photo = `/uploads/${req.files.photo[0].filename}`;
//       examData.photoFileName = req.files.photo[0].originalname;
//     }

//     // Handle question-related files
//     if (req.files) {
//       const audioFiles = Object.keys(req.files).filter(key => key.startsWith('audio-'));
//       const questionPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('questionPhoto-'));
//       const answerPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('answerPhoto-'));

//       audioFiles.forEach(audioKey => {
//         const index = parseInt(audioKey.split('-')[1]);
//         if (examData.questions[index]) {
//           examData.questions[index].audio = `/uploads/${req.files[audioKey][0].filename}`;
//         }
//       });

//       questionPhotoFiles.forEach(photoKey => {
//         const index = parseInt(photoKey.split('-')[1]);
//         if (examData.questions[index]) {
//           examData.questions[index].questionPhoto = `/uploads/${req.files[photoKey][0].filename}`;
//         }
//       });

//       answerPhotoFiles.forEach(photoKey => {
//         const [_, qIndex, aIndex] = photoKey.split('-').map((part, idx) => idx > 0 ? parseInt(part) : part);
//         if (examData.questions[qIndex] && examData.questions[qIndex].answers[aIndex]) {
//           examData.questions[qIndex].answers[aIndex].photo = `/uploads/${req.files[photoKey][0].filename}`;
//         }
//       });
//     }

//     const updatedExam = await Exam.findByIdAndUpdate(req.params.id, examData, { new: true });
//     if (!updatedExam) {
//       return res.status(404).json({ message: 'Exam not found' });
//     }
//     res.status(200).json(updatedExam);
//   } catch (error) {
//     if (req.files) {
//       Object.values(req.files).forEach(fileArray => {
//         fileArray.forEach(file => {
//           fs.unlink(file.path, (err) => {
//             if (err) console.error('Error deleting uploaded file:', err);
//           });
//         });
//       });
//     }
//     console.error('Error in updateExam:', error);
//     res.status(500).json({ message: 'Failed to update exam', error: error.message });
//   }
// };

// exports.deleteExam = async (req, res) => {
//   try {
//     const exam = await Exam.findByIdAndDelete(req.params.id);
//     if (!exam) {
//       return res.status(404).json({ message: 'Exam not found' });
//     }
//     if (exam.photo) {
//       fs.unlink(path.join(__dirname, '..', 'public', exam.photo), (err) => {
//         if (err) console.error('Error deleting photo:', err);
//       });
//     }
//     exam.questions.forEach(question => {
//       if (question.audio) {
//         fs.unlink(path.join(__dirname, '..', 'public', question.audio), (err) => {
//           if (err) console.error('Error deleting audio:', err);
//         });
//       }
//       if (question.questionPhoto) {
//         fs.unlink(path.join(__dirname, '..', 'public', question.questionPhoto), (err) => {
//           if (err) console.error('Error deleting question photo:', err);
//         });
//       }
//       question.answers.forEach(answer => {
//         if (answer.photo) {
//           fs.unlink(path.join(__dirname, '..', 'public', answer.photo), (err) => {
//             if (err) console.error('Error deleting answer photo:', err);
//           });
//         }
//       });
//     });
//     res.status(200).json({ message: 'Exam deleted successfully' });
//   } catch (error) {
//     console.error('Error in deleteExam:', error);
//     res.status(500).json({ message: 'Failed to delete exam', error: error.message });
//   }
// };




const Exam = require('../models/examModel');
const path = require('path');
const fs = require('fs');

exports.createExam = async (req, res) => {
  try {
    console.log('Received POST request to /api/exams');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    if (!req.body.examData) {
      throw new Error('examData is required');
    }
    if (typeof req.body.examData !== 'string') {
      throw new Error('examData must be a string');
    }

    let examData;
    try {
      examData = JSON.parse(req.body.examData);
    } catch (parseError) {
      throw new Error(`Invalid examData format: ${parseError.message}`);
    }

    // Validate required fields
    if (!examData.language) throw new Error('Language is required');
    if (!examData.topic) throw new Error('Topic is required');
    if (!examData.duration) throw new Error('Duration is required');
    if (examData.readingTimeMinutes && (isNaN(parseInt(examData.readingTimeMinutes)) || parseInt(examData.readingTimeMinutes) < 0)) {
      throw new Error('Reading section time must be a non-negative number');
    }
    if (examData.listeningTimeMinutes && (isNaN(parseInt(examData.listeningTimeMinutes)) || parseInt(examData.listeningTimeMinutes) < 0)) {
      throw new Error('Listening section time must be a non-negative number');
    }
    if (!examData.questions || !Array.isArray(examData.questions) || examData.questions.length === 0) {
      throw new Error('At least one question is required');
    }

    // Validate questions
    examData.questions.forEach((question, index) => {
      if (!question.questionNumber) throw new Error(`Question ${index + 1}: Question number is required`);
      if (!question.type) throw new Error(`Question ${index + 1}: Type is required`);
      if (question.type === 'listening' && !question.questionText) {
        throw new Error(`Question ${index + 1}: Question text is required for listening questions`);
      }
      if (question.type === 'reading' && question.questionPhoto && !question.questionText) {
        // Allow photo-based questions to have optional text
        question.questionText = question.questionText || "";
      }
      if (question.type === 'reading' && !question.questionPhoto && !question.questionText) {
        throw new Error(`Question ${index + 1}: Either question text or photo is required for reading questions`);
      }
      if (question.type === 'listening' && !req.files?.[`audio-${index}`]) {
        throw new Error(`Question ${index + 1}: Audio file is required for listening questions`);
      }
      if (!question.answers || question.answers.length !== 4) {
        throw new Error(`Question ${index + 1}: Exactly four answers are required`);
      }
      question.answers.forEach((answer, ansIndex) => {
        if (answer.photo && !answer.text) {
          // Allow photo-based answers to have optional text
          answer.text = answer.text || "";
        }
        if (!answer.text && !answer.photo) {
          throw new Error(`Question ${index + 1}, Answer ${ansIndex + 1}: Either text or photo is required`);
        }
      });
      if (!question.answers.some(answer => answer.isCorrect)) {
        throw new Error(`Question ${index + 1}: At least one answer must be marked as correct`);
      }
    });

    // Handle exam photo
    if (req.files && req.files.photo) {
      examData.photo = `/uploads/${req.files.photo[0].filename}`;
      examData.photoFileName = req.files.photo[0].originalname;
      console.log(`Photo saved: /uploads/${req.files.photo[0].filename}`);
    }

    // Handle question-related files
    if (req.files) {
      const audioFiles = Object.keys(req.files).filter(key => key.startsWith('audio-'));
      const questionPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('questionPhoto-'));
      const answerPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('answerPhoto-'));

      audioFiles.forEach(audioKey => {
        const index = parseInt(audioKey.split('-')[1]);
        if (examData.questions[index]) {
          examData.questions[index].audio = `/uploads/${req.files[audioKey][0].filename}`;
          console.log(`Audio file saved for question ${index}: /uploads/${req.files[audioKey][0].filename}`);
        } else {
          console.warn(`No question found at index ${index} for audio file ${audioKey}`);
        }
      });

      questionPhotoFiles.forEach(photoKey => {
        const index = parseInt(photoKey.split('-')[1]);
        if (examData.questions[index]) {
          examData.questions[index].questionPhoto = `/uploads/${req.files[photoKey][0].filename}`;
          console.log(`Question photo saved for question ${index}: /uploads/${req.files[photoKey][0].filename}`);
        } else {
          console.warn(`No question found at index ${index} for question photo ${photoKey}`);
        }
      });

      answerPhotoFiles.forEach(photoKey => {
        const [_, qIndex, aIndex] = photoKey.split('-').map((part, idx) => idx > 0 ? parseInt(part) : part);
        if (examData.questions[qIndex] && examData.questions[qIndex].answers[aIndex]) {
          examData.questions[qIndex].answers[aIndex].photo = `/uploads/${req.files[photoKey][0].filename}`;
          console.log(`Answer photo saved for question ${qIndex}, answer ${aIndex}: /uploads/${req.files[photoKey][0].filename}`);
        } else {
          console.warn(`No answer found at question ${qIndex}, answer ${aIndex} for answer photo ${photoKey}`);
        }
      });
    }

    const newExam = new Exam(examData);
    const savedExam = await newExam.save();
    console.log('Exam saved to MongoDB:', savedExam);
    res.status(201).json(savedExam);
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
          });
        });
      });
    }
    console.error('Error in createExam:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation failed', errors });
    } else {
      res.status(400).json({ message: error.message || 'Failed to create exam' });
    }
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    console.error('Error in getAllExams:', error);
    res.status(500).json({ message: 'Failed to retrieve exams', error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.error('Error in getExamById:', error);
    res.status(500).json({ message: 'Failed to retrieve exam', error: error.message });
  }
};

exports.getExamPhoto = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam || !exam.photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    const photoPath = path.join(__dirname, '..', 'public', exam.photo);
    res.sendFile(photoPath);
  } catch (error) {
    console.error('Error in getExamPhoto:', error);
    res.status(500).json({ message: 'Failed to retrieve photo', error: error.message });
  }
};

exports.getQuestionAudio = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    const questionIndex = parseInt(req.params.questionId) - 1;
    const question = exam.questions[questionIndex];
    if (!question || !question.audio) {
      return res.status(404).json({ message: 'Audio not found for this question' });
    }
    const audioPath = path.join(__dirname, '..', 'public', question.audio);
    res.sendFile(audioPath);
  } catch (error) {
    console.error('Error in getQuestionAudio:', error);
    res.status(500).json({ message: 'Failed to retrieve audio', error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    let examData;
    if (req.body.examData) {
      examData = JSON.parse(req.body.examData);
    }

    // Validate questions
    if (examData.questions) {
      examData.questions.forEach((question, index) => {
        if (!question.questionNumber) throw new Error(`Question ${index + 1}: Question number is required`);
        if (!question.type) throw new Error(`Question ${index + 1}: Type is required`);
        if (question.type === 'listening' && !question.questionText) {
          throw new Error(`Question ${index + 1}: Question text is required for listening questions`);
        }
        if (question.type === 'reading' && question.questionPhoto && !question.questionText) {
          question.questionText = question.questionText || "";
        }
        if (question.type === 'reading' && !question.questionPhoto && !question.questionText) {
          throw new Error(`Question ${index + 1}: Either question text or photo is required for reading questions`);
        }
        if (question.type === 'listening' && !req.files?.[`audio-${index}`] && !question.audio) {
          throw new Error(`Question ${index + 1}: Audio file is required for listening questions`);
        }
        if (!question.answers || question.answers.length !== 4) {
          throw new Error(`Question ${index + 1}: Exactly four answers are required`);
        }
        question.answers.forEach((answer, ansIndex) => {
          if (answer.photo && !answer.text) {
            answer.text = answer.text || "";
          }
          if (!answer.text && !answer.photo) {
            throw new Error(`Question ${index + 1}, Answer ${ansIndex + 1}: Either text or photo is required`);
          }
        });
        if (!question.answers.some(answer => answer.isCorrect)) {
          throw new Error(`Question ${index + 1}: At least one answer must be marked as correct`);
        }
      });
    }

    // Validate section times
    if (examData.readingTimeMinutes && (isNaN(parseInt(examData.readingTimeMinutes)) || parseInt(examData.readingTimeMinutes) < 0)) {
      throw new Error('Reading section time must be a non-negative number');
    }
    if (examData.listeningTimeMinutes && (isNaN(parseInt(examData.listeningTimeMinutes)) || parseInt(examData.listeningTimeMinutes) < 0)) {
      throw new Error('Listening section time must be a non-negative number');
    }

    // Handle exam photo
    if (req.files && req.files.photo) {
      examData.photo = `/uploads/${req.files.photo[0].filename}`;
      examData.photoFileName = req.files.photo[0].originalname;
    }

    // Handle question-related files
    if (req.files) {
      const audioFiles = Object.keys(req.files).filter(key => key.startsWith('audio-'));
      const questionPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('questionPhoto-'));
      const answerPhotoFiles = Object.keys(req.files).filter(key => key.startsWith('answerPhoto-'));

      audioFiles.forEach(audioKey => {
        const index = parseInt(audioKey.split('-')[1]);
        if (examData.questions[index]) {
          examData.questions[index].audio = `/uploads/${req.files[audioKey][0].filename}`;
        }
      });

      questionPhotoFiles.forEach(photoKey => {
        const index = parseInt(photoKey.split('-')[1]);
        if (examData.questions[index]) {
          examData.questions[index].questionPhoto = `/uploads/${req.files[photoKey][0].filename}`;
        }
      });

      answerPhotoFiles.forEach(photoKey => {
        const [_, qIndex, aIndex] = photoKey.split('-').map((part, idx) => idx > 0 ? parseInt(part) : part);
        if (examData.questions[qIndex] && examData.questions[qIndex].answers[aIndex]) {
          examData.questions[qIndex].answers[aIndex].photo = `/uploads/${req.files[photoKey][0].filename}`;
        }
      });
    }

    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, examData, { new: true });
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(updatedExam);
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
          });
        });
      });
    }
    console.error('Error in updateExam:', error);
    res.status(500).json({ message: 'Failed to update exam', error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (exam.photo) {
      fs.unlink(path.join(__dirname, '..', 'public', exam.photo), (err) => {
        if (err) console.error('Error deleting photo:', err);
      });
    }
    exam.questions.forEach(question => {
      if (question.audio) {
        fs.unlink(path.join(__dirname, '..', 'public', question.audio), (err) => {
          if (err) console.error('Error deleting audio:', err);
        });
      }
      if (question.questionPhoto) {
        fs.unlink(path.join(__dirname, '..', 'public', question.questionPhoto), (err) => {
          if (err) console.error('Error deleting question photo:', err);
        });
      }
      question.answers.forEach(answer => {
        if (answer.photo) {
          fs.unlink(path.join(__dirname, '..', 'public', answer.photo), (err) => {
            if (err) console.error('Error deleting answer photo:', err);
          });
        }
      });
    });
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error in deleteExam:', error);
    res.status(500).json({ message: 'Failed to delete exam', error: error.message });
  }
};