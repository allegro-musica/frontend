import React, {useEffect, useState} from 'react';

export interface RemainingTimeProps {
    ms: number;
    onEnd: () => void;
}

const RemainingTime = (props: RemainingTimeProps) => {
    const {
        ms,
        onEnd
    } = props;

    const [remaining, setRemaining] = useState(ms);

    useEffect(() => {
       let interval = setInterval(() => {
           setRemaining(remaining - 1);

           if (remaining <= 0) onEnd();
       }, 1000);

        return () => {
            clearInterval(interval);
        }
    });

    return (
        <span>
            {remaining}
        </span>
    );
};

export default RemainingTime;
