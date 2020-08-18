import React from 'react';
import ProfilePage from '@/General/ProfilePage'
import Head from 'next/head';

const Main= () => {
    
    return (
        <>
            <Head>
                <title>ChatAway user profile</title>
            </Head>
            <ProfilePage>
                <div className="main-info">
                    <h2>This is the profile page</h2>
                    <p>Here you can change your avatar, password, name and more to come!</p>
                </div>
            </ProfilePage>
        </>
    );
}
 
export default Main;