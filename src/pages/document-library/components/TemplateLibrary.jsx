import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Full demonstration templates with comprehensive healthcare content
  const templates = [
    {
      id: 'TEMP-001',
      name: 'Physical Therapy Initial Assessment',
      category: 'physical-therapy',
      description: 'Comprehensive initial assessment template for PT patients with detailed evaluation sections',
      createdBy: 'Dr. Sarah Chen',
      createdDate: '2024-08-15',
      usageCount: 145,
      status: 'active',
      tags: ['assessment', 'initial', 'physical-therapy', 'comprehensive'],
      templateContent: {
        sections: [
          {
            title: 'Patient Demographics & Referral Information',
            fields: [
              { label: 'Patient Name', type: 'text', placeholder: 'Enter full name', required: true },
              { label: 'Date of Birth', type: 'date', required: true },
              { label: 'Medical Record Number', type: 'text', placeholder: 'MRN', required: true },
              { label: 'Referring Physician', type: 'text', placeholder: 'Dr. Last Name' },
              { label: 'Date of Referral', type: 'date' },
              { label: 'Diagnosis/ICD-10 Code', type: 'text', placeholder: 'e.g., M54.2 - Cervicalgia' },
              { label: 'Insurance Information', type: 'textarea', placeholder: 'Primary/Secondary insurance details' }
            ]
          },
          {
            title: 'Chief Complaint & History',
            fields: [
              { label: 'Chief Complaint', type: 'textarea', placeholder: 'Patient-reported primary concern', required: true },
              { label: 'History of Present Illness', type: 'textarea', placeholder: 'Onset, duration, mechanism of injury' },
              { label: 'Pain Scale (0-10)', type: 'number', min: 0, max: 10 },
              { label: 'Pain Location', type: 'text', placeholder: 'Anatomical location and radiation' },
              { label: 'Pain Quality', type: 'select', options: ['Sharp', 'Dull', 'Aching', 'Burning', 'Tingling'] },
              { label: 'Aggravating Factors', type: 'textarea', placeholder: 'Activities that worsen symptoms' },
              { label: 'Relieving Factors', type: 'textarea', placeholder: 'Activities or positions that help' }
            ]
          },
          {
            title: 'Medical History & Medications',
            fields: [
              { label: 'Past Medical History', type: 'textarea', placeholder: 'Relevant medical conditions, surgeries' },
              { label: 'Current Medications', type: 'textarea', placeholder: 'Include dosages and frequency' },
              { label: 'Allergies', type: 'text', placeholder: 'Drug/environmental allergies' },
              { label: 'Surgical History', type: 'textarea', placeholder: 'Previous surgeries with dates' },
              { label: 'Family History', type: 'textarea', placeholder: 'Relevant family medical history' }
            ]
          },
          {
            title: 'Functional Assessment',
            fields: [
              { label: 'Activities of Daily Living', type: 'textarea', placeholder: 'Impact on bathing, dressing, grooming' },
              { label: 'Work/Occupational Status', type: 'text', placeholder: 'Current work limitations' },
              { label: 'Recreation/Sports', type: 'textarea', placeholder: 'Recreational activities affected' },
              { label: 'Sleep Quality', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] },
              { label: 'Functional Goals', type: 'textarea', placeholder: 'Patient-stated functional goals' }
            ]
          },
          {
            title: 'Physical Examination',
            fields: [
              { label: 'Observation/Posture', type: 'textarea', placeholder: 'Visual assessment findings' },
              { label: 'Range of Motion - Cervical', type: 'textarea', placeholder: 'Flexion, Extension, Side-bending, Rotation' },
              { label: 'Range of Motion - Lumbar', type: 'textarea', placeholder: 'Forward bending, Extension, Side-bending' },
              { label: 'Strength Testing', type: 'textarea', placeholder: 'Manual muscle testing results (0-5 scale)' },
              { label: 'Neurological Screen', type: 'textarea', placeholder: 'Reflexes, sensation, special tests' },
              { label: 'Palpation Findings', type: 'textarea', placeholder: 'Muscle tone, trigger points, inflammation' },
              { label: 'Special Tests', type: 'textarea', placeholder: 'Orthopedic tests performed and results' }
            ]
          },
          {
            title: 'Assessment & Plan',
            fields: [
              { label: 'Clinical Impression', type: 'textarea', placeholder: 'Professional assessment of findings', required: true },
              { label: 'Impairments Identified', type: 'textarea', placeholder: 'List primary impairments' },
              { label: 'Rehabilitation Potential', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
              { label: 'Frequency/Duration', type: 'text', placeholder: 'e.g., 3x/week for 6-8 weeks' },
              { label: 'Short-term Goals (2-4 weeks)', type: 'textarea', placeholder: 'Specific, measurable goals' },
              { label: 'Long-term Goals (6-8 weeks)', type: 'textarea', placeholder: 'Functional outcome goals' },
              { label: 'Treatment Plan', type: 'textarea', placeholder: 'Interventions and techniques to be used' }
            ]
          }
        ],
        sampleContent: `
PHYSICAL THERAPY INITIAL ASSESSMENT

Patient: John Smith, DOB: 03/15/1975, MRN: PT-2024-001
Referring Physician: Dr. Jennifer Martinez
Date of Assessment: August 26, 2024

CHIEF COMPLAINT:
"I've had severe lower back pain for 3 weeks after lifting heavy boxes at work. The pain shoots down my right leg."

HISTORY OF PRESENT ILLNESS:
45-year-old male warehouse worker reports acute onset of lower back pain following lifting incident on 8/5/2024. Pain rated 8/10, located in L4-L5 region with radiation to posterior right thigh. Pain worsens with forward bending, prolonged sitting. Improves with lying supine with knees flexed.

PHYSICAL EXAMINATION:
- Observation: Antalgic gait, list to left, guarded movement patterns
- ROM: Lumbar flexion 30° (limited by pain), extension 10°, side-bending R 15°/L 20°
- Strength: Hip flexors 4/5 bilaterally, ankle dorsiflexion R 3+/5, L 5/5
- Neurological: Diminished L5 dermatome sensation, absent Achilles reflex (right)
- Special Tests: SLR positive at 35° (right), negative (left)

ASSESSMENT:
Lumbar radiculopathy with L5 nerve root involvement secondary to acute disc pathology. Moderate functional limitations affecting work and ADLs.

PLAN:
PT 3x/week for 6-8 weeks focusing on:
- Pain management and inflammation control
- McKenzie approach for centralization
- Core stabilization and postural training
- Gradual return to work activities

Short-term Goals (4 weeks):
1. Decrease pain to 4/10 or less
2. Improve lumbar flexion to 60°
3. Normalize gait pattern
4. Return to light duty work activities

Therapist: Dr. Sarah Chen, DPT
License #: PT12345
        `
      }
    },
    {
      id: 'TEMP-002',
      name: 'Progress Note - Weekly',
      category: 'progress-notes',
      description: 'Weekly progress documentation template with detailed treatment tracking and outcomes',
      createdBy: 'Mark Johnson, PT',
      createdDate: '2024-08-10',
      usageCount: 198,
      status: 'active',
      tags: ['progress', 'weekly', 'treatment', 'outcomes'],
      templateContent: {
        sections: [
          {
            title: 'Session Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Date of Service', type: 'date', required: true },
              { label: 'Session Number', type: 'number', placeholder: 'e.g., Session 8 of 24' },
              { label: 'Duration', type: 'text', placeholder: 'e.g., 60 minutes' },
              { label: 'Therapist', type: 'text', required: true }
            ]
          },
          {
            title: 'Subjective Assessment',
            fields: [
              { label: 'Patient Report', type: 'textarea', placeholder: 'Patient-reported changes, concerns, improvements' },
              { label: 'Pain Level Today (0-10)', type: 'number', min: 0, max: 10 },
              { label: 'Pain Level This Week (0-10)', type: 'number', min: 0, max: 10 },
              { label: 'Sleep Quality', type: 'select', options: ['Much Better', 'Somewhat Better', 'Same', 'Worse'] },
              { label: 'Activity Tolerance', type: 'textarea', placeholder: 'Changes in daily activities, work, recreation' },
              { label: 'Medication Changes', type: 'text', placeholder: 'Any changes in pain medications' }
            ]
          },
          {
            title: 'Objective Findings',
            fields: [
              { label: 'Range of Motion', type: 'textarea', placeholder: 'Measured changes in ROM' },
              { label: 'Strength Assessment', type: 'textarea', placeholder: 'MMT results, functional strength' },
              { label: 'Balance/Coordination', type: 'textarea', placeholder: 'Static/dynamic balance assessment' },
              { label: 'Gait Analysis', type: 'textarea', placeholder: 'Gait pattern observations' },
              { label: 'Functional Tests', type: 'textarea', placeholder: 'Outcome measures, functional assessments' }
            ]
          },
          {
            title: 'Treatment Provided',
            fields: [
              { label: 'Manual Therapy', type: 'textarea', placeholder: 'Joint mobilization, soft tissue techniques' },
              { label: 'Therapeutic Exercise', type: 'textarea', placeholder: 'Specific exercises performed' },
              { label: 'Modalities Used', type: 'textarea', placeholder: 'Heat, ice, electrical stimulation, etc.' },
              { label: 'Patient Education', type: 'textarea', placeholder: 'Education topics covered' },
              { label: 'Home Exercise Program', type: 'textarea', placeholder: 'HEP modifications or additions' }
            ]
          },
          {
            title: 'Assessment & Planning',
            fields: [
              { label: 'Progress Toward Goals', type: 'textarea', placeholder: 'Progress on each established goal', required: true },
              { label: 'Response to Treatment', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor', 'No Change'] },
              { label: 'Barriers to Progress', type: 'textarea', placeholder: 'Factors limiting progress' },
              { label: 'Plan Modifications', type: 'textarea', placeholder: 'Changes to treatment approach' },
              { label: 'Next Session Plan', type: 'textarea', placeholder: 'Focus for upcoming sessions' },
              { label: 'Discharge Planning', type: 'textarea', placeholder: 'Anticipated discharge timeline' }
            ]
          }
        ],
        sampleContent: `
WEEKLY PROGRESS NOTE

Patient: Sarah Williams, MRN: PT-2024-015
Date: August 26, 2024 | Session 12 of 18 | Duration: 60 minutes
Therapist: Mark Johnson, PT

SUBJECTIVE:
Patient reports "significant improvement" in shoulder pain over the past week. Pain decreased from 7/10 to 3/10 with overhead activities. Sleep improved - now waking only once per night vs. 3-4 times previously. Successfully returned to modified work duties (desk work only). Some difficulty with reaching overhead in kitchen cabinets.

OBJECTIVE:
- ROM: Shoulder flexion improved to 145° (from 120° last week), abduction 130° (from 110°)
- Strength: External rotation 4/5 (improved from 3+/5), forward flexion 4+/5
- Functional reach test: 85% of uninvolved side (improved from 60%)
- DASH score: 35 (improved from 52 at baseline)

TREATMENT PROVIDED:
1. Manual therapy: Grade III mobilizations to GH joint, scapular mobilization
2. Therapeutic exercise: Progressive strengthening program, rotator cuff exercises
3. Functional training: Overhead reaching patterns, work simulation activities
4. Modalities: Ice post-treatment for inflammation control
5. Education: Posture awareness, activity pacing strategies

ASSESSMENT:
Excellent progress toward established goals. Patient demonstrating 70% improvement in functional mobility and significant pain reduction. Responding very well to current treatment approach. No barriers to progress identified.

PLAN:
Continue current treatment plan 2x/week for 3 more weeks. Progress exercises to include sport-specific activities (tennis preparation). Begin discharge planning with focus on independent home program. Reassess at session 15 for potential early discharge.

Goals Update:
✓ Goal 1: Achieve 140° shoulder flexion - MET
✓ Goal 2: Reduce pain to 4/10 or less - EXCEEDED
◐ Goal 3: Return to full work duties - IN PROGRESS (75% complete)
◐ Goal 4: Resume recreational tennis - TO BE ADDRESSED

Next session: Progress strengthening, introduce plyometric activities, refine HEP
        `
      }
    },
    {
      id: 'TEMP-003',
      name: 'Occupational Therapy Evaluation',
      category: 'occupational-therapy',
      description: 'Comprehensive OT evaluation with ADL assessment and cognitive screening',
      createdBy: 'Lisa Williams, OT',
      createdDate: '2024-08-12',
      usageCount: 89,
      status: 'active',
      tags: ['evaluation', 'occupational-therapy', 'ADL', 'cognitive'],
      templateContent: {
        sections: [
          {
            title: 'Referral & Background Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Date of Evaluation', type: 'date', required: true },
              { label: 'Age/DOB', type: 'date', required: true },
              { label: 'Diagnosis', type: 'text', placeholder: 'Primary and secondary diagnoses' },
              { label: 'Referral Source', type: 'text', placeholder: 'Physician/healthcare provider' },
              { label: 'Reason for Referral', type: 'textarea', placeholder: 'Specific concerns or goals' }
            ]
          },
          {
            title: 'Occupational Profile',
            fields: [
              { label: 'Prior Level of Function', type: 'textarea', placeholder: 'Independence level before current condition' },
              { label: 'Living Situation', type: 'select', options: ['Lives Alone', 'With Spouse', 'With Family', 'Assisted Living', 'Nursing Home'] },
              { label: 'Primary Caregiver', type: 'text', placeholder: 'Name and relationship if applicable' },
              { label: 'Occupation/Work History', type: 'textarea', placeholder: 'Current and past work responsibilities' },
              { label: 'Leisure Interests', type: 'textarea', placeholder: 'Hobbies, recreational activities' },
              { label: 'Cultural Considerations', type: 'textarea', placeholder: 'Cultural factors affecting care' }
            ]
          },
          {
            title: 'Activities of Daily Living (ADL) Assessment',
            fields: [
              { label: 'Bathing/Showering', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Dressing Upper Body', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Dressing Lower Body', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Toileting', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Grooming/Hygiene', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Feeding/Eating', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] }
            ]
          },
          {
            title: 'Instrumental ADLs (IADL)',
            fields: [
              { label: 'Meal Preparation', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Housekeeping', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Laundry', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Shopping', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Financial Management', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] },
              { label: 'Transportation', type: 'select', options: ['Independent', 'Modified Independent', 'Supervision', 'Minimal Assist', 'Moderate Assist', 'Maximal Assist', 'Dependent'] }
            ]
          },
          {
            title: 'Physical Assessment',
            fields: [
              { label: 'Range of Motion', type: 'textarea', placeholder: 'UE/LE ROM limitations and measurements' },
              { label: 'Muscle Strength', type: 'textarea', placeholder: 'Functional strength assessment' },
              { label: 'Sensation', type: 'textarea', placeholder: 'Light touch, proprioception, stereognosis' },
              { label: 'Vision/Perception', type: 'textarea', placeholder: 'Visual fields, visual processing' },
              { label: 'Coordination', type: 'textarea', placeholder: 'Fine/gross motor coordination' },
              { label: 'Balance/Mobility', type: 'textarea', placeholder: 'Sitting/standing balance, transfers' }
            ]
          },
          {
            title: 'Cognitive Assessment',
            fields: [
              { label: 'Alertness/Attention', type: 'select', options: ['Normal', 'Mildly Impaired', 'Moderately Impaired', 'Severely Impaired'] },
              { label: 'Memory', type: 'select', options: ['Normal', 'Mildly Impaired', 'Moderately Impaired', 'Severely Impaired'] },
              { label: 'Problem Solving', type: 'select', options: ['Normal', 'Mildly Impaired', 'Moderately Impaired', 'Severely Impaired'] },
              { label: 'Executive Function', type: 'select', options: ['Normal', 'Mildly Impaired', 'Moderately Impaired', 'Severely Impaired'] },
              { label: 'Safety Awareness', type: 'textarea', placeholder: 'Judgment and safety awareness in activities' },
              { label: 'Standardized Tests Used', type: 'textarea', placeholder: 'MMSE, MoCA, COPM, etc.' }
            ]
          },
          {
            title: 'Assessment & Treatment Plan',
            fields: [
              { label: 'Primary Problem Areas', type: 'textarea', placeholder: 'Key occupational performance issues', required: true },
              { label: 'Rehabilitation Potential', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
              { label: 'Short-term Goals', type: 'textarea', placeholder: 'Goals for next 2-4 weeks', required: true },
              { label: 'Long-term Goals', type: 'textarea', placeholder: 'Goals for discharge', required: true },
              { label: 'Frequency/Duration', type: 'text', placeholder: 'Recommended treatment schedule' },
              { label: 'Treatment Approaches', type: 'textarea', placeholder: 'Specific interventions planned' },
              { label: 'Equipment/Adaptations', type: 'textarea', placeholder: 'DME or environmental modifications needed' }
            ]
          }
        ],
        sampleContent: `
OCCUPATIONAL THERAPY EVALUATION

Patient: Margaret Thompson, DOB: 09/12/1938, Age: 85
Date: August 26, 2024
Diagnosis: Right CVA with left hemiparesis, mild cognitive impairment
Referral: Dr. Robert Kim - Evaluate ADL status and discharge planning

OCCUPATIONAL PROFILE:
Mrs. Thompson is a retired teacher who lives alone in a two-story home. She was independent in all ADLs and IADLs prior to her stroke 10 days ago. She has two adult children who live nearby and are very supportive. She enjoyed gardening, reading, and volunteer work at the local library.

ADL ASSESSMENT:
- Bathing: Moderate Assist (safety concerns, requires help with lower body)
- Dressing UE: Modified Independent with adaptive techniques
- Dressing LE: Minimal Assist (difficulty with balance, shoe tying)
- Toileting: Supervision (requires grab bars, verbal cues for safety)
- Grooming: Modified Independent (uses adaptive equipment)
- Feeding: Independent

IADL ASSESSMENT:
- Meal Preparation: Supervision (safety with hot items, sequencing)
- Housekeeping: Moderate Assist (limited mobility, endurance)
- Laundry: Maximal Assist (unable to carry items, operate machines)
- Shopping: Dependent (requires transportation, physical assistance)
- Financial Management: Supervision (mild difficulty with calculations)
- Transportation: Dependent (no longer driving)

PHYSICAL ASSESSMENT:
- ROM: Left UE limited - shoulder flexion 90°, elbow extension -15°
- Strength: Left UE 2-3/5 throughout, right UE 5/5
- Sensation: Diminished light touch left arm and leg
- Vision: Left visual field cut present
- Coordination: Intact right UE, left UE impaired
- Balance: Requires contact guard assistance for standing

COGNITIVE ASSESSMENT:
- Alertness: Normal
- Memory: Mildly impaired (difficulty with new learning)
- Problem Solving: Mildly impaired (concrete thinking)
- Executive Function: Mildly impaired (planning/sequencing)
- Safety Awareness: Impaired (overestimates abilities)
- MMSE: 24/30 (mild cognitive impairment)

ASSESSMENT:
Mrs. Thompson presents with significant functional limitations affecting ADL and IADL performance following right CVA. Primary concerns include left-sided weakness, visual processing deficits, mild cognitive changes, and impaired safety awareness. Good rehabilitation potential with family support.

TREATMENT PLAN:
OT 5x/week for 2-3 weeks (inpatient), then 3x/week outpatient

Short-term Goals (2 weeks):
1. Increase ADL independence to Modified Independent level
2. Demonstrate safe transfers with supervision
3. Improve left UE function for bimanual activities
4. Establish compensatory strategies for visual field cut

Long-term Goals (6-8 weeks):
1. Return home safely with appropriate support systems
2. Resume meaningful leisure activities with modifications
3. Manage basic IADLs with minimal assistance
4. Demonstrate safety awareness in home environment

Treatment Approaches:
- Neurodevelopmental techniques for motor recovery
- Cognitive rehabilitation strategies
- ADL training with adaptive equipment
- Visual compensation techniques
- Family education and training
- Home safety evaluation and modifications

Equipment Recommendations:
- Shower chair and grab bars
- Dressing aids (sock aid, button hook)
- One-handed kitchen equipment
- Magnification aids for reading

Therapist: Lisa Williams, OTR/L
License #: OT67890
        `
      }
    },
    {
      id: 'TEMP-004',
      name: 'Speech Language Assessment',
      category: 'speech-therapy',
      description: 'Comprehensive speech-language pathology evaluation with detailed communication assessment',
      createdBy: 'Jennifer Davis, SLP',
      createdDate: '2024-08-08',
      usageCount: 76,
      status: 'active',
      tags: ['speech', 'language', 'assessment', 'communication'],
      templateContent: {
        sections: [
          {
            title: 'Identifying Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Date of Birth/Age', type: 'date', required: true },
              { label: 'Date of Evaluation', type: 'date', required: true },
              { label: 'Medical Record Number', type: 'text', required: true },
              { label: 'Referral Source', type: 'text', placeholder: 'Physician, teacher, family' },
              { label: 'Primary Language', type: 'text', placeholder: 'Native/preferred language' },
              { label: 'Educational Level', type: 'text', placeholder: 'Highest grade completed' }
            ]
          },
          {
            title: 'History & Background',
            fields: [
              { label: 'Chief Complaint', type: 'textarea', placeholder: 'Primary communication concerns' },
              { label: 'Onset/Duration', type: 'textarea', placeholder: 'When did symptoms begin, progression' },
              { label: 'Medical History', type: 'textarea', placeholder: 'Relevant medical conditions, medications' },
              { label: 'Previous Speech Therapy', type: 'textarea', placeholder: 'Past therapy history and outcomes' },
              { label: 'Educational History', type: 'textarea', placeholder: 'Academic performance, special services' },
              { label: 'Communication Environment', type: 'textarea', placeholder: 'Home/work communication patterns' }
            ]
          },
          {
            title: 'Speech Sound Production',
            fields: [
              { label: 'Articulation Assessment', type: 'textarea', placeholder: 'Consonant and vowel production accuracy' },
              { label: 'Phonological Processes', type: 'textarea', placeholder: 'Error patterns observed' },
              { label: 'Stimulability Testing', type: 'textarea', placeholder: 'Sounds that can be corrected with cues' },
              { label: 'Speech Intelligibility', type: 'select', options: ['Normal', 'Mildly Reduced', 'Moderately Reduced', 'Severely Reduced', 'Unintelligible'] },
              { label: 'Connected Speech Sample', type: 'textarea', placeholder: 'Analysis of conversational speech' }
            ]
          },
          {
            title: 'Language Assessment',
            fields: [
              { label: 'Receptive Language', type: 'textarea', placeholder: 'Comprehension of words, sentences, concepts' },
              { label: 'Expressive Language', type: 'textarea', placeholder: 'Vocabulary, grammar, sentence structure' },
              { label: 'Pragmatic Language', type: 'textarea', placeholder: 'Social communication skills' },
              { label: 'Narrative Skills', type: 'textarea', placeholder: 'Story telling and retelling abilities' },
              { label: 'Reading Comprehension', type: 'textarea', placeholder: 'If applicable - literacy skills' },
              { label: 'Written Expression', type: 'textarea', placeholder: 'If applicable - writing skills' }
            ]
          },
          {
            title: 'Voice & Fluency',
            fields: [
              { label: 'Voice Quality', type: 'select', options: ['Normal', 'Hoarse', 'Breathy', 'Strained', 'Rough'] },
              { label: 'Vocal Pitch', type: 'select', options: ['Appropriate', 'Too High', 'Too Low', 'Monotone'] },
              { label: 'Vocal Loudness', type: 'select', options: ['Appropriate', 'Too Loud', 'Too Soft', 'Variable'] },
              { label: 'Resonance', type: 'select', options: ['Normal', 'Hypernasal', 'Hyponasal', 'Mixed'] },
              { label: 'Fluency Assessment', type: 'textarea', placeholder: 'Stuttering patterns, disfluencies' },
              { label: 'Rate of Speech', type: 'select', options: ['Normal', 'Too Fast', 'Too Slow', 'Variable'] }
            ]
          },
          {
            title: 'Oral Motor Examination',
            fields: [
              { label: 'Facial Symmetry', type: 'select', options: ['Symmetrical', 'Mild Asymmetry', 'Moderate Asymmetry', 'Severe Asymmetry'] },
              { label: 'Lip Strength/Mobility', type: 'textarea', placeholder: 'Lip seal, protrusion, retraction' },
              { label: 'Tongue Strength/Mobility', type: 'textarea', placeholder: 'Tongue protrusion, elevation, lateralization' },
              { label: 'Jaw Function', type: 'textarea', placeholder: 'Jaw opening, closing, lateral movement' },
              { label: 'Soft Palate Function', type: 'textarea', placeholder: 'Velopharyngeal closure' },
              { label: 'Diadochokinesis', type: 'textarea', placeholder: 'Rapid alternating movements' }
            ]
          },
          {
            title: 'Swallowing Assessment (if applicable)',
            fields: [
              { label: 'Oral Preparatory Phase', type: 'textarea', placeholder: 'Chewing, bolus formation' },
              { label: 'Oral Transit Phase', type: 'textarea', placeholder: 'Bolus transport to pharynx' },
              { label: 'Pharyngeal Phase', type: 'textarea', placeholder: 'Swallow initiation, laryngeal elevation' },
              { label: 'Signs of Aspiration', type: 'textarea', placeholder: 'Coughing, wet voice, throat clearing' },
              { label: 'Diet Recommendations', type: 'textarea', placeholder: 'Texture modifications needed' }
            ]
          },
          {
            title: 'Standardized Test Results',
            fields: [
              { label: 'Tests Administered', type: 'textarea', placeholder: 'List of formal assessments used' },
              { label: 'Test Scores/Results', type: 'textarea', placeholder: 'Standard scores, percentiles, age equivalents' },
              { label: 'Behavioral Observations', type: 'textarea', placeholder: 'Attention, cooperation, effort level' }
            ]
          },
          {
            title: 'Assessment & Recommendations',
            fields: [
              { label: 'Clinical Impression', type: 'textarea', placeholder: 'Primary diagnosis/communication disorder', required: true },
              { label: 'Severity Level', type: 'select', options: ['Mild', 'Mild-Moderate', 'Moderate', 'Moderate-Severe', 'Severe'] },
              { label: 'Prognosis', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Guarded', 'Poor'] },
              { label: 'Treatment Recommendations', type: 'textarea', placeholder: 'Frequency, duration, focus areas', required: true },
              { label: 'Short-term Goals', type: 'textarea', placeholder: 'Goals for next 3 months', required: true },
              { label: 'Long-term Goals', type: 'textarea', placeholder: 'Goals for 6-12 months', required: true },
              { label: 'Home Program', type: 'textarea', placeholder: 'Family/caregiver recommendations' },
              { label: 'Additional Referrals', type: 'textarea', placeholder: 'Other professionals needed' }
            ]
          }
        ],
        sampleContent: `
SPEECH-LANGUAGE PATHOLOGY EVALUATION

Patient: Emma Rodriguez, DOB: 03/22/2018, Age: 6 years, 5 months
Date: August 26, 2024 | MRN: SLP-2024-045
Referral: Mrs. Johnson (Kindergarten Teacher) - articulation concerns
Primary Language: English (Spanish spoken at home)

HISTORY & BACKGROUND:
Emma's teacher reports difficulty understanding her speech, particularly with certain sounds. Parents indicate she has always been "hard to understand" but assumed she would "grow out of it." No significant medical history. Normal hearing screening at school.

SPEECH SOUND PRODUCTION:
Goldman-Fristoe Test of Articulation-3:
- Standard Score: 72 (3rd percentile, below average)
- Error patterns: Stopping of fricatives (s→t, z→d), Deaffrication (ch→t, j→d)
- Stimulable for /s/ and /z/ sounds with visual cues
- Speech Intelligibility: Moderately reduced (65% intelligible to unfamiliar listeners)

LANGUAGE ASSESSMENT:
CELF-5 (Clinical Evaluation of Language Fundamentals):
- Core Language Score: 95 (37th percentile, average range)
- Receptive Language: Age-appropriate comprehension
- Expressive Language: Good vocabulary and grammar for age
- Pragmatic skills: Appropriate social communication
- Bilingual considerations: Code-switching observed but appropriate

VOICE & FLUENCY:
- Voice quality: Normal
- Vocal pitch/loudness: Age-appropriate
- Fluency: Normal (no stuttering behaviors observed)
- Rate: Slightly fast when excited

ORAL MOTOR EXAMINATION:
- Facial symmetry: Normal
- Lip strength/mobility: Adequate for speech
- Tongue strength: Slightly weak, difficulty with tip elevation
- Tongue mobility: Limited fine motor control
- Soft palate: Normal function
- Diadochokinesis: Below age expectations

BEHAVIORAL OBSERVATIONS:
Emma was cooperative and engaged throughout the evaluation. She showed awareness of her speech errors and appeared frustrated when not understood. Attention and effort were excellent.

CLINICAL IMPRESSION:
Moderate phonological disorder characterized by stopping and deaffrication patterns. Speech intelligibility is significantly impacted, affecting academic and social communication. Good stimulability suggests favorable prognosis for improvement.

RECOMMENDATIONS:
Speech therapy 2x/week for 6 months, then reassess

Short-term Goals (3 months):
1. Produce /s/ and /z/ sounds accurately in CV and VC syllables with 80% accuracy
2. Eliminate stopping pattern for /s/ and /z/ in single words with 70% accuracy
3. Increase overall speech intelligibility to 75% with unfamiliar listeners

Long-term Goals (6-12 months):
1. Produce all targeted sounds accurately in conversational speech
2. Achieve age-appropriate speech intelligibility (90%+ with unfamiliar listeners)
3. Demonstrate confidence in verbal communication across settings

Treatment Focus:
- Phonological awareness activities
- Articulation therapy using traditional and cycles approaches
- Home practice program with family involvement
- Collaboration with classroom teacher for carryover

Home Program:
- Daily practice activities provided to family
- Speech sound production games
- Reading activities to support phonological awareness

Additional Recommendations:
- Classroom accommodations as needed
- Re-evaluation in 6 months to assess progress
- Consider ENT referral if hearing concerns arise

Clinician: Jennifer Davis, M.S., CCC-SLP
License #: SLP-12345
ASHA #: 12345678
        `
      }
    },
    {
      id: 'TEMP-005',name: 'Treatment Plan Template',category: 'treatment-plans',description: 'Comprehensive interdisciplinary treatment planning template with measurable goals',createdBy: 'Dr. Sarah Chen',createdDate: '2024-08-05',usageCount: 167,status: 'active',
      tags: ['treatment', 'plan', 'comprehensive', 'interdisciplinary'],
      templateContent: {
        sections: [
          {
            title: 'Patient Information',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Medical Record Number', type: 'text', required: true },
              { label: 'Date of Birth', type: 'date', required: true },
              { label: 'Date of Plan', type: 'date', required: true },
              { label: 'Primary Diagnosis', type: 'text', placeholder: 'ICD-10 code and description', required: true },
              { label: 'Secondary Diagnoses', type: 'textarea', placeholder: 'Additional relevant conditions' },
              { label: 'Physician of Record', type: 'text', required: true }
            ]
          },
          {
            title: 'Assessment Summary',
            fields: [
              { label: 'Current Functional Status', type: 'textarea', placeholder: 'Overall functional abilities and limitations' },
              { label: 'Cognitive Status', type: 'textarea', placeholder: 'Mental status, alertness, orientation' },
              { label: 'Physical Impairments', type: 'textarea', placeholder: 'Strength, ROM, mobility limitations' },
              { label: 'Communication Status', type: 'textarea', placeholder: 'Speech, language, comprehension abilities' },
              { label: 'Social/Environmental Factors', type: 'textarea', placeholder: 'Support system, barriers, resources' },
              { label: 'Safety Concerns', type: 'textarea', placeholder: 'Fall risk, cognitive safety, medical stability' }
            ]
          },
          {
            title: 'Patient/Family Goals',
            fields: [
              { label: 'Patient-Stated Goals', type: 'textarea', placeholder: 'What the patient wants to achieve' },
              { label: 'Family Priorities', type: 'textarea', placeholder: 'Family goals and concerns' },
              { label: 'Discharge Setting Goal', type: 'select', options: ['Home', 'Home with Services', 'Assisted Living', 'Skilled Nursing', 'Long-term Care'] },
              { label: 'Timeline Expectations', type: 'text', placeholder: 'Patient/family expected timeline' }
            ]
          },
          {
            title: 'Physical Therapy Goals',
            fields: [
              { label: 'PT Short-term Goals', type: 'textarea', placeholder: 'Goals for next 2-4 weeks' },
              { label: 'PT Long-term Goals', type: 'textarea', placeholder: 'Goals for discharge/end of episode' },
              { label: 'PT Frequency/Duration', type: 'text', placeholder: 'e.g., 3x/week for 6-8 weeks' },
              { label: 'PT Interventions', type: 'textarea', placeholder: 'Specific treatment approaches and techniques' }
            ]
          },
          {
            title: 'Occupational Therapy Goals',
            fields: [
              { label: 'OT Short-term Goals', type: 'textarea', placeholder: 'Goals for next 2-4 weeks' },
              { label: 'OT Long-term Goals', type: 'textarea', placeholder: 'Goals for discharge/end of episode' },
              { label: 'OT Frequency/Duration', type: 'text', placeholder: 'e.g., 2x/week for 4-6 weeks' },
              { label: 'OT Interventions', type: 'textarea', placeholder: 'ADL training, cognitive strategies, equipment' }
            ]
          },
          {
            title: 'Speech Therapy Goals',
            fields: [
              { label: 'ST Short-term Goals', type: 'textarea', placeholder: 'Goals for next 2-4 weeks' },
              { label: 'ST Long-term Goals', type: 'textarea', placeholder: 'Goals for discharge/end of episode' },
              { label: 'ST Frequency/Duration', type: 'text', placeholder: 'e.g., 2x/week for 8 weeks' },
              { label: 'ST Interventions', type: 'textarea', placeholder: 'Communication strategies, swallowing therapy' }
            ]
          },
          {
            title: 'Nursing/Medical Goals',
            fields: [
              { label: 'Medical Management Goals', type: 'textarea', placeholder: 'Medication management, symptom control' },
              { label: 'Nursing Care Goals', type: 'textarea', placeholder: 'Skin integrity, nutrition, safety' },
              { label: 'Pain Management Plan', type: 'textarea', placeholder: 'Pain assessment and interventions' },
              { label: 'Medication Reconciliation', type: 'textarea', placeholder: 'Current medications and changes needed' }
            ]
          },
          {
            title: 'Psychosocial Goals',
            fields: [
              { label: 'Social Work Goals', type: 'textarea', placeholder: 'Discharge planning, resource coordination' },
              { label: 'Psychological Support', type: 'textarea', placeholder: 'Mental health, coping strategies' },
              { label: 'Family Education Needs', type: 'textarea', placeholder: 'Training and education requirements' },
              { label: 'Community Resources', type: 'textarea', placeholder: 'Services needed post-discharge' }
            ]
          },
          {
            title: 'Discharge Planning',
            fields: [
              { label: 'Anticipated Discharge Date', type: 'date' },
              { label: 'Discharge Disposition', type: 'select', options: ['Home', 'Home with Home Health', 'Home with Outpatient Therapy', 'Assisted Living', 'Skilled Nursing Facility', 'Long-term Care', 'Hospice', 'Other'] },
              { label: 'Equipment/DME Needed', type: 'textarea', placeholder: 'Wheelchairs, walkers, hospital beds, etc.' },
              { label: 'Home Modifications', type: 'textarea', placeholder: 'Ramps, grab bars, stair lifts, etc.' },
              { label: 'Continuing Care Services', type: 'textarea', placeholder: 'Home health, outpatient therapy, physician follow-up' },
              { label: 'Barriers to Discharge', type: 'textarea', placeholder: 'Issues that may delay discharge' }
            ]
          },
          {
            title: 'Team Communication & Review',
            fields: [
              { label: 'Treatment Team Members', type: 'textarea', placeholder: 'List all disciplines involved in care' },
              { label: 'Plan Review Schedule', type: 'text', placeholder: 'How often will plan be reviewed' },
              { label: 'Communication Method', type: 'text', placeholder: 'How team will communicate updates' },
              { label: 'Family Conference Date', type: 'date' },
              { label: 'Progress Review Date', type: 'date' }
            ]
          }
        ],
        sampleContent: `
INTERDISCIPLINARY TREATMENT PLAN

Patient: Robert Martinez, MRN: TP-2024-089
DOB: 11/08/1952, Age: 71 | Date of Plan: August 26, 2024
Primary Diagnosis: Right total hip replacement (Z96.641), Status post fall
Secondary: 
- Type 2 diabetes mellitus without complications (E11.9)
- Hypertension (I10)
- Chronic kidney disease, stage 3 (N18.3)
- Anemia, unspecified (D64.9)
- Deconditioning (Z87.891)
Physician: Dr. Michael Foster, Orthopedic Surgery

ASSESSMENT SUMMARY:
Mr. Martinez is a 71-year-old male, POD #3 following right total hip replacement after fall at home. Currently requiring maximal assistance for mobility and transfers. Alert and oriented x3 with mild short-term memory deficits. Lives alone in single-story home with son nearby. Motivated for rehabilitation but anxious about returning home independently.

Current Status:
- Mobility: Bed mobility modified independent, transfers maximal assist
- ADLs: Requires assistance with bathing, dressing lower body, toileting
- Cognitive: Alert and oriented x3, no cognitive deficits
- Communication: Normal speech and comprehension
- Safety: Moderate fall risk due to deconditioning and oxygen tubing

REHABILITATION SERVICES SUMMARY:
Physical Therapy:
- Improved from bedrest to ambulating 100 feet with walker
- Educated on energy conservation techniques
- Recommended outpatient PT for continued strengthening and endurance

Occupational Therapy:
- ADL assessment completed, shower chair recommended
- Energy conservation and breathing techniques taught
- Home safety evaluation completed with recommendations

Goals Achieved:
- Stable on 2L oxygen at rest and with activity
- Independent with ADLs using adaptive techniques
- Safe mobility with walker and supervision

Goals Continuing:
- Improve endurance and strength (outpatient PT)
- Wean from supplemental oxygen as tolerated
- Optimize COPD self-management

DISCHARGE MEDICATIONS:
1. Albuterol inhaler 2 puffs every 4 hours as needed for shortness of breath
2. Tiotropium (Spiriva) 18 mcg inhaled daily
3. Prednisone 20 mg daily x 5 days, then 10 mg daily x 5 days, then discontinue
4. Metformin 500 mg twice daily with meals
5. Lisinopril 10 mg daily
6. Furosemide 20 mg daily
7. Ferrous sulfate 325 mg daily with food
8. Multivitamin daily

New Medications: Tiotropium (long-acting bronchodilator)
Discontinued: None
Changes: Prednisone taper added, metformin temporarily held during hospitalization but resumed

EQUIPMENT & SUPPLIES:
- Oxygen concentrator with 2L continuous flow
- 50 feet of oxygen tubing
- Walker with seat
- Shower chair
- Raised toilet seat
- Home pulse oximeter for monitoring

Equipment Training: Patient and daughter educated on oxygen safety, pulse oximeter use, proper inhaler techniques demonstrated and return-demonstrated successfully.

DISCHARGE INSTRUCTIONS:
Activity: No restrictions, gradually increase activity as tolerated. Use oxygen with all activities. Rest when short of breath.

Diet: Heart-healthy, low-sodium diet (2g sodium). Diabetic diet with carbohydrate counting. Encourage adequate protein intake for healing.

Medications: Take all medications as prescribed. Complete steroid taper as directed. Monitor blood sugars closely while on steroids.

COPD Management:
- Use inhalers as prescribed
- Monitor oxygen saturation with pulse oximeter
- Continue with breathing exercises learned in therapy
- Energy conservation techniques with activities

WARNING SIGNS - Call doctor or 911 if you experience:
- Increased shortness of breath not relieved by medications
- Chest pain or pressure
- Oxygen saturation below 90%
- Fever over 101°F
- Increased cough with yellow/green sputum
- Swelling in legs or feet
- Dizziness or fainting

FOLLOW-UP CARE:
Physician Appointments:
- Dr. Williams (primary care) - September 2, 2024 (1 week)
- Dr. Rodriguez (pulmonologist) - September 9, 2024 (2 weeks)

Outpatient Services:
- Physical therapy 2x/week x 4 weeks starting August 29, 2024
- Pulmonary rehabilitation program referral (patient to call)
- Home health nursing 2x/week x 2 weeks for oxygen monitoring and medication compliance

Laboratory Tests:
- CBC and comprehensive metabolic panel in 1 week
- HbA1c in 3 months

DISCHARGE DISPOSITION:
Home with daughter's assistance and home health services

Transportation: Private vehicle with daughter
Emergency Contact: Linda Thompson (daughter) (555) 123-4567
Primary Care Provider: Dr. Patricia Williams (555) 987-6543

Discharge Coordinator: Susan Martinez, RN, BSN, CCM
Contact: susan.martinez@hospital.com | (555) 456-7890

Discharge Completed: August 26, 2024 at 2:30 PM
Condition at Discharge: Stable, improved from admission
        `
      }
    },
    {
      id: 'TEMP-006',name: 'Discharge Summary',category: 'discharge',description: 'Comprehensive patient discharge documentation with detailed care summary and follow-up instructions',createdBy: 'Mark Johnson, PT',createdDate: '2024-08-03',usageCount: 134,status: 'active',
      tags: ['discharge', 'summary', 'documentation', 'follow-up'],
      templateContent: {
        sections: [
          {
            title: 'Patient Identification',
            fields: [
              { label: 'Patient Name', type: 'text', required: true },
              { label: 'Medical Record Number', type: 'text', required: true },
              { label: 'Date of Birth', type: 'date', required: true },
              { label: 'Admission Date', type: 'date', required: true },
              { label: 'Discharge Date', type: 'date', required: true },
              { label: 'Length of Stay', type: 'text', placeholder: 'e.g., 12 days' },
              { label: 'Attending Physician', type: 'text', required: true }
            ]
          },
          {
            title: 'Admission & Discharge Diagnoses',
            fields: [
              { label: 'Admission Diagnosis', type: 'textarea', placeholder: 'Primary reason for admission with ICD-10', required: true },
              { label: 'Discharge Diagnosis (Primary)', type: 'text', placeholder: 'Principal diagnosis with ICD-10', required: true },
              { label: 'Secondary Diagnoses', type: 'textarea', placeholder: 'All secondary conditions with ICD-10 codes' },
              { label: 'Procedures Performed', type: 'textarea', placeholder: 'Surgeries, procedures with CPT codes' },
              { label: 'Complications', type: 'textarea', placeholder: 'Any complications during stay' }
            ]
          },
          {
            title: 'Clinical Summary',
            fields: [
              { label: 'History of Present Illness', type: 'textarea', placeholder: 'Brief summary of illness leading to admission' },
              { label: 'Hospital Course', type: 'textarea', placeholder: 'Significant events, treatments, response to care', required: true },
              { label: 'Consultations', type: 'textarea', placeholder: 'Specialist consultations obtained' },
              { label: 'Significant Tests/Procedures', type: 'textarea', placeholder: 'Key diagnostic results and findings' },
              { label: 'Response to Treatment', type: 'textarea', placeholder: 'Patient response to interventions' }
            ]
          },
          {
            title: 'Functional Status at Discharge',
            fields: [
              { label: 'Mobility Status', type: 'textarea', placeholder: 'Ambulation ability, assistive devices used' },
              { label: 'ADL Independence Level', type: 'textarea', placeholder: 'Self-care abilities at discharge' },
              { label: 'Cognitive Status', type: 'textarea', placeholder: 'Mental status, orientation, capacity' },
              { label: 'Communication Status', type: 'textarea', placeholder: 'Speech, language, comprehension abilities' },
              { label: 'Safety Considerations', type: 'textarea', placeholder: 'Fall risk, safety awareness, precautions' }
            ]
          },
          {
            title: 'Rehabilitation Services Summary',
            fields: [
              { label: 'Physical Therapy Summary', type: 'textarea', placeholder: 'PT interventions, progress achieved, goals met' },
              { label: 'Occupational Therapy Summary', type: 'textarea', placeholder: 'OT interventions, functional improvements, equipment trials' },
              { label: 'Speech Therapy Summary', type: 'textarea', placeholder: 'ST interventions, communication/swallowing progress' },
              { label: 'Goals Achieved', type: 'textarea', placeholder: 'Treatment goals that were met during stay' },
              { label: 'Goals Continuing', type: 'textarea', placeholder: 'Goals requiring ongoing therapy post-discharge' }
            ]
          },
          {
            title: 'Discharge Medications',
            fields: [
              { label: 'Discharge Medications', type: 'textarea', placeholder: 'Complete list with dosages, frequency, duration', required: true },
              { label: 'New Medications', type: 'textarea', placeholder: 'Medications started during admission' },
              { label: 'Discontinued Medications', type: 'textarea', placeholder: 'Home medications that were stopped' },
              { label: 'Medication Changes', type: 'textarea', placeholder: 'Dosage changes to existing medications' },
              { label: 'Medication Allergies', type: 'text', placeholder: 'Known drug allergies and reactions' }
            ]
          },
          {
            title: 'Equipment & Supplies',
            fields: [
              { label: 'Durable Medical Equipment', type: 'textarea', placeholder: 'Wheelchairs, walkers, hospital beds, etc.' },
              { label: 'Adaptive Equipment', type: 'textarea', placeholder: 'Reachers, sock aids, shower chairs, etc.' },
              { label: 'Medical Supplies', type: 'textarea', placeholder: 'Wound care supplies, catheters, etc.' },
              { label: 'Equipment Training Provided', type: 'textarea', placeholder: 'Patient/family education completed' }
            ]
          },
          {
            title: 'Discharge Instructions & Education',
            fields: [
              { label: 'Activity Restrictions', type: 'textarea', placeholder: 'Physical limitations, precautions, weight-bearing status' },
              { label: 'Diet Instructions', type: 'textarea', placeholder: 'Dietary restrictions, modifications, supplements' },
              { label: 'Wound Care Instructions', type: 'textarea', placeholder: 'Dressing changes, incision care, signs to watch' },
              { label: 'Patient Education Topics', type: 'textarea', placeholder: 'Disease management, self-care techniques taught' },
              { label: 'Warning Signs', type: 'textarea', placeholder: 'Symptoms requiring immediate medical attention' }
            ]
          },
          {
            title: 'Follow-up Care Plan',
            fields: [
              { label: 'Physician Follow-up', type: 'textarea', placeholder: 'Appointments scheduled with doctors', required: true },
              { label: 'Outpatient Therapy Services', type: 'textarea', placeholder: 'PT, OT, ST appointments arranged' },
              { label: 'Home Health Services', type: 'textarea', placeholder: 'Nursing, therapy, aide services ordered' },
              { label: 'Laboratory/Diagnostic Tests', type: 'textarea', placeholder: 'Follow-up tests ordered' },
              { label: 'Community Resources', type: 'textarea', placeholder: 'Support services, transportation, meals' }
            ]
          },
          {
            title: 'Discharge Disposition & Contact',
            fields: [
              { label: 'Discharge Disposition', type: 'select', options: ['Home', 'Home with Home Health', 'Assisted Living', 'Skilled Nursing Facility', 'Rehabilitation Hospital', 'Long-term Care', 'Hospice', 'Other'], required: true },
              { label: 'Discharge Transportation', type: 'text', placeholder: 'How patient left facility' },
              { label: 'Emergency Contact', type: 'text', placeholder: 'Name and phone number' },
              { label: 'Primary Care Provider', type: 'text', placeholder: 'Name and contact information' },
              { label: 'Discharge Coordinator', type: 'text', placeholder: 'Staff member completing discharge' }
            ]
          }
        ],
        sampleContent: `
DISCHARGE SUMMARY

Patient: Elizabeth Thompson, MRN: DS-2024-156
DOB: 07/22/1943, Age: 81
Admission Date: August 14, 2024
Discharge Date: August 26, 2024
Length of Stay: 12 days
Attending Physician: Dr. Patricia Williams, Internal Medicine

ADMISSION DIAGNOSIS:
Acute exacerbation of COPD (J44.1) with respiratory failure

DISCHARGE DIAGNOSES:
Primary: Chronic obstructive pulmonary disease with acute exacerbation (J44.1)
Secondary: 
- Type 2 diabetes mellitus without complications (E11.9)
- Hypertension (I10)
- Chronic kidney disease, stage 3 (N18.3)
- Anemia, unspecified (D64.9)
- Deconditioning (Z87.891)

PROCEDURES PERFORMED:
- None

CLINICAL SUMMARY:
Mrs. Thompson is an 81-year-old female with a history of moderate to severe COPD who presented to the ED with increased shortness of breath, productive cough with yellow sputum, and decreased functional capacity over 5 days. She was admitted for acute COPD exacerbation with hypoxemia requiring supplemental oxygen.

Hospital Course:
Patient was treated with systemic corticosteroids (methylprednisolone), bronchodilators (albuterol/ipratropium), and supplemental oxygen via nasal cannula. Chest X-ray showed hyperinflation consistent with COPD but no acute infiltrates. ABG on admission showed mild hypoxemia and compensated respiratory acidosis. Patient responded well to treatment with improvement in dyspnea and oxygen saturation. Oxygen requirements decreased from 4L to 2L NC by day 5.

Significant deconditioning noted due to prolonged bed rest during illness. Physical and occupational therapy consulted for mobility and safety assessment. Blood glucose levels required adjustment of diabetes medications during steroid treatment.

FUNCTIONAL STATUS AT DISCHARGE:
Mobility: Ambulates 100 feet with walker and 2L oxygen, requires supervision for safety
ADLs: Modified independent with bathing (shower chair), independent with other ADLs
Cognitive: Alert and oriented x3, no cognitive deficits
Communication: Normal speech and comprehension
Safety: Moderate fall risk due to deconditioning and oxygen tubing

REHABILITATION SERVICES SUMMARY:
Physical Therapy:
- Improved from bedrest to ambulating 100 feet with walker
- Educated on energy conservation techniques
- Recommended outpatient PT for continued strengthening and endurance

Occupational Therapy:
- ADL assessment completed, shower chair recommended
- Energy conservation and breathing techniques taught
- Home safety evaluation completed with recommendations

Goals Achieved:
- Stable on 2L oxygen at rest and with activity
- Independent with ADLs using adaptive techniques
- Safe mobility with walker and supervision

Goals Continuing:
- Improve endurance and strength (outpatient PT)
- Wean from supplemental oxygen as tolerated
- Optimize COPD self-management

DISCHARGE MEDICATIONS:
1. Albuterol inhaler 2 puffs every 4 hours as needed for shortness of breath
2. Tiotropium (Spiriva) 18 mcg inhaled daily
3. Prednisone 20 mg daily x 5 days, then 10 mg daily x 5 days, then discontinue
4. Metformin 500 mg twice daily with meals
5. Lisinopril 10 mg daily
6. Furosemide 20 mg daily
7. Ferrous sulfate 325 mg daily with food
8. Multivitamin daily

New Medications: Tiotropium (long-acting bronchodilator)
Discontinued: None
Changes: Prednisone taper added, metformin temporarily held during hospitalization but resumed

EQUIPMENT & SUPPLIES:
- Oxygen concentrator with 2L continuous flow
- 50 feet of oxygen tubing
- Walker with seat
- Shower chair
- Raised toilet seat
- Home pulse oximeter for monitoring

Equipment Training: Patient and daughter educated on oxygen safety, pulse oximeter use, proper inhaler techniques demonstrated and return-demonstrated successfully.

DISCHARGE INSTRUCTIONS:
Activity: No restrictions, gradually increase activity as tolerated. Use oxygen with all activities. Rest when short of breath.

Diet: Heart-healthy, low-sodium diet (2g sodium). Diabetic diet with carbohydrate counting. Encourage adequate protein intake for healing.

Medications: Take all medications as prescribed. Complete steroid taper as directed. Monitor blood sugars closely while on steroids.

COPD Management:
- Use inhalers as prescribed
- Monitor oxygen saturation with pulse oximeter
- Continue with breathing exercises learned in therapy
- Energy conservation techniques with activities

WARNING SIGNS - Call doctor or 911 if you experience:
- Increased shortness of breath not relieved by medications
- Chest pain or pressure
- Oxygen saturation below 90%
- Fever over 101°F
- Increased cough with yellow/green sputum
- Swelling in legs or feet
- Dizziness or fainting

FOLLOW-UP CARE:
Physician Appointments:
- Dr. Williams (primary care) - September 2, 2024 (1 week)
- Dr. Rodriguez (pulmonologist) - September 9, 2024 (2 weeks)

Outpatient Services:
- Physical therapy 2x/week x 4 weeks starting August 29, 2024
- Pulmonary rehabilitation program referral (patient to call)
- Home health nursing 2x/week x 2 weeks for oxygen monitoring and medication compliance

Laboratory Tests:
- CBC and comprehensive metabolic panel in 1 week
- HbA1c in 3 months

DISCHARGE DISPOSITION:
Home with daughter's assistance and home health services

Transportation: Private vehicle with daughter
Emergency Contact: Linda Thompson (daughter) (555) 123-4567
Primary Care Provider: Dr. Patricia Williams (555) 987-6543

Discharge Coordinator: Susan Martinez, RN, BSN, CCM
Contact: susan.martinez@hospital.com | (555) 456-7890

Discharge Completed: August 26, 2024 at 2:30 PM
Condition at Discharge: Stable, improved from admission
        `
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates?.length, icon: 'Layout', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'physical-therapy', name: 'Physical Therapy', count: templates?.filter(t => t?.category === 'physical-therapy')?.length, icon: 'Activity', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'occupational-therapy', name: 'Occupational Therapy', count: templates?.filter(t => t?.category === 'occupational-therapy')?.length, icon: 'Users', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'speech-therapy', name: 'Speech Therapy', count: templates?.filter(t => t?.category === 'speech-therapy')?.length, icon: 'MessageCircle', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'progress-notes', name: 'Progress Notes', count: templates?.filter(t => t?.category === 'progress-notes')?.length, icon: 'TrendingUp', color: 'bg-green-50 text-green-700 border-green-200' },
    { id: 'treatment-plans', name: 'Treatment Plans', count: templates?.filter(t => t?.category === 'treatment-plans')?.length, icon: 'Target', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'discharge', name: 'Discharge', count: templates?.filter(t => t?.category === 'discharge')?.length, icon: 'CheckCircle', color: 'bg-teal-50 text-teal-700 border-teal-200' }
  ];

  const filteredTemplates = templates?.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      template?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplates(prev => 
      prev?.includes(templateId)
        ? prev?.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplate = (template) => {
    console.log('Using template:', template?.id);
    const templateData = encodeURIComponent(JSON.stringify({
      id: template?.id,
      name: template?.name,
      content: template?.templateContent,
      sampleContent: template?.templateContent?.sampleContent
    }));
    navigate(`/document-editor?template=${templateData}`);
  };

  const handleEditTemplate = (template) => {
    console.log('Editing template:', template?.id);
    navigate(`/template-builder?id=${template?.id}&mode=edit`);
  };

  const handleDuplicateTemplate = (template) => {
    console.log('Duplicating template:', template?.id);
  };

  const handleCreateTemplate = () => {
    navigate('/template-builder');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'archived': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories?.find(cat => cat?.id === categoryId);
    return category?.icon || 'FileText';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories?.find(cat => cat?.id === categoryId);
    return category?.color || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Template Library</h1>
              <p className="text-gray-600 text-sm max-w-2xl">
                Professional healthcare documentation templates designed for clinical excellence and compliance
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Grid View"
                >
                  <Icon name="Grid" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  title="List View"
                >
                  <Icon name="List" size={16} />
                </button>
              </div>
              
              <Button variant="outline" size="sm" className="border-gray-300 hover:border-gray-400">
                <Icon name="Import" size={16} className="mr-2" />
                Import Template
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={handleCreateTemplate}>
                <Icon name="Plus" size={16} className="mr-2" />
                Create Template
              </Button>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            {selectedTemplates?.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <Icon name="CheckSquare" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedTemplates?.length} selected
                </span>
                <div className="flex items-center gap-1 ml-2">
                  <Button variant="outline" size="xs" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                    <Icon name="Download" size={12} className="mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="xs" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                    <Icon name="Archive" size={12} className="mr-1" />
                    Archive
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Enhanced Categories Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Categories</h3>
              <span className="text-xs text-gray-500">{filteredTemplates?.length} templates</span>
            </div>
            
            <div className="space-y-2">
              {categories?.map(category => (
                <button
                  key={category?.id}
                  onClick={() => setSelectedCategory(category?.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    selectedCategory === category?.id
                      ? `${category?.color} shadow-sm ring-1 ring-black/5 scale-[1.02]`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedCategory === category?.id ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                    <Icon name={category?.icon} size={16} className={selectedCategory === category?.id ? '' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{category?.name}</div>
                    <div className={`text-xs ${selectedCategory === category?.id ? 'opacity-80' : 'text-gray-500'}`}>
                      {category?.count} template{category?.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Library Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Templates</span>
                  <span className="font-medium text-gray-900">{templates?.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Templates</span>
                  <span className="font-medium text-emerald-600">{templates?.filter(t => t?.status === 'active')?.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Most Used</span>
                  <span className="font-medium text-gray-900">Progress Notes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Templates Grid/List */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredTemplates?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Icon name="FileText" size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                {searchTerm ? `No templates match "${searchTerm}". Try adjusting your search terms.` 
                  : 'No templates match your current selection. Try a different category or create a new template.'}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateTemplate}>
                <Icon name="Plus" size={16} className="mr-2" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedCategory === 'all' ? 'All Templates' : categories?.find(c => c?.id === selectedCategory)?.name}
                  </h2>
                  {searchTerm && (
                    <span className="text-sm text-gray-500">
                      Search results for "{searchTerm}"
                    </span>
                  )}
                </div>
                
                <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Sort by Usage</option>
                  <option>Sort by Name</option>
                  <option>Sort by Date Created</option>
                  <option>Sort by Category</option>
                </select>
              </div>

              {/* Templates Display */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTemplates?.map(template => (
                    <div
                      key={template?.id}
                      className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedTemplates?.includes(template?.id)}
                            onChange={() => handleTemplateSelect(template?.id)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`p-1.5 rounded-lg ${getCategoryColor(template?.category)} border`}>
                                <Icon name={getCategoryIcon(template?.category)} size={14} />
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(template?.status)}`}>
                                {template?.status}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-sm leading-5 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {template?.name}
                            </h4>
                            <p className="text-xs text-gray-500 leading-4 line-clamp-2 mb-3">
                              {template?.description}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                              <Icon name="CheckCircle2" size={12} />
                              <span>Clinical examples included</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handlePreviewTemplate(template)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview Template"
                          >
                            <Icon name="Eye" size={14} className="text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Template"
                          >
                            <Icon name="Edit3" size={14} className="text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Template Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {template?.tags?.slice(0, 3)?.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {template?.tags?.length > 3 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            +{template?.tags?.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Template Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={12} />
                            {template?.createdBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="BarChart3" size={12} />
                            {template?.usageCount} uses
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(template?.createdDate)?.toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs border-gray-300 hover:border-gray-400"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Icon name="Copy" size={12} className="mr-1" />
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleUseTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-3">
                  {filteredTemplates?.map(template => (
                    <div
                      key={template?.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedTemplates?.includes(template?.id)}
                          onChange={() => handleTemplateSelect(template?.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        
                        <div className={`p-2 rounded-lg ${getCategoryColor(template?.category)} border`}>
                          <Icon name={getCategoryIcon(template?.category)} size={16} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {template?.name}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(template?.status)}`}>
                              {template?.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                            {template?.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={12} />
                              {template?.createdBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Calendar" size={12} />
                              {new Date(template?.createdDate)?.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="BarChart3" size={12} />
                              {template?.usageCount} uses
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            <Icon name="Eye" size={14} className="mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleUseTemplate(template)}
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enhanced Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl max-h-[90vh] overflow-hidden w-full shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getCategoryColor(previewTemplate?.category)} border`}>
                    <Icon name={getCategoryIcon(previewTemplate?.category)} size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{previewTemplate?.name}</h3>
                    <p className="text-gray-600 mb-3 max-w-2xl">{previewTemplate?.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icon name="User" size={14} />
                        Created by {previewTemplate?.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        {new Date(previewTemplate?.createdDate)?.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="BarChart3" size={14} />
                        {previewTemplate?.usageCount} uses
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon name="X" size={24} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8">
                <div className="space-y-8">
                  {previewTemplate?.templateContent?.sections?.map((section, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                        {section?.title}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {section?.fields?.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                              {field?.label}
                              {field?.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {field?.type === 'textarea' ? (
                              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[80px] text-sm text-gray-600">
                                {field?.placeholder}
                              </div>
                            ) : field?.type === 'select' ? (
                              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-sm text-gray-600">
                                {field?.options?.[0] || 'Select option'}
                              </div>
                            ) : (
                              <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-sm text-gray-600">
                                {field?.placeholder || field?.label}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Enhanced Sample Content */}
                  {previewTemplate?.templateContent?.sampleContent && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Icon name="FileCheck" size={20} className="text-blue-600" />
                        Sample Clinical Documentation
                      </h4>
                      <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono overflow-auto max-h-96 leading-relaxed">
                          {previewTemplate?.templateContent?.sampleContent}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="Info" size={16} />
                <span>This template includes {previewTemplate?.templateContent?.sections?.length} sections with clinical examples</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)} className="border-gray-300">
                  Close Preview
                </Button>
                <Button onClick={() => handleUseTemplate(previewTemplate)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Icon name="ArrowRight" size={16} className="mr-2" />
                  Use This Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;