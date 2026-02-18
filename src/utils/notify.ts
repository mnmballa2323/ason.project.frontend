export interface NotifyPayload {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}

export const notify = (title: string, message: string, type: NotifyPayload['type'] = 'info', duration = 3000) => {
    const event = new CustomEvent<NotifyPayload>('sys-notification', {
        detail: { title, message, type, duration }
    });
    window.dispatchEvent(event);
};
