import React from 'react';
import { Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './css/App.css';

function Home() {
    return (

        <div container className="menu">
                <Grid item >
                <Link to="/booking">
                        <Button className="button-image">
                        <img src="/img/logo-Booking.png" alt="Image 1" />
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                <Link to="/room">
                        <Button className="button-image">
                        <img src="/img/logo-setting-room.png" alt="Image 2" />
                        </Button>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to="/about">
                        <Button className="button-image">
                            <img src="/img/logo-car.png" alt="Image 3" />
                        </Button>
                    </Link>
                </Grid>

           

            </div>
            
        
    );
}

export default Home;
