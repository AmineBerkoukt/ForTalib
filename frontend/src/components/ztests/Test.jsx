import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

const Test = () => {
    return (
        <div>
            <button
                className="btn btn-primary btn-lg"
                onClick={notify}>Make me a toast</button>
            <Toaster />
        </div>
    );
};

export default Test