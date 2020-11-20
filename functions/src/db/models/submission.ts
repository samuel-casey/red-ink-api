interface Submission {
    submission_id: string;
    title: string;
    url: string;
    writer_id: string;
    editor_id: string;
    created_at: string; 
    edits_complete: boolean;
}

export {Submission}