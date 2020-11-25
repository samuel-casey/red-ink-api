interface Submission {
    submission_id?: string;
    title: string;
    url: string;
    writer_id: string;
    editor_id: string;
    created_at: string; 
    edits_status: string;
    notes: string;
    writer_notified: boolean;
    editor_reminded: boolean;
}

interface SubmissionEmail {
    to_email: string;
    reply_to: string;
    title: string;
    link: string;
    notes: string;
    first_name: string;
    last_name: string;
}

export {Submission, SubmissionEmail}