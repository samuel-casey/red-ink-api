interface Submission {
    submission_id: string;
    title: string;
    url: string;
    writer_id: string;
    editor_id: string;
    created_at: string; 
    edits_complete: boolean;
    notes: string;
}

interface SubmissionEmail {
    title: string;
    link: string;
    editorFirstName: string;
    editorLastName: string;
    writerEmail: string;
    editorEmail: string;
    created_at: string; 
    notes: string;
}


export {Submission}