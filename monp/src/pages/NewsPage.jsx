import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Grid,
  Card, 
  CardContent, 
  Button, 
  Box,
  Fade,
  useTheme,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const NewsPage = () => {
  const theme = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:3000/newsRoutes/health');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actualités');
      }
      const data = await response.json();
      const filteredNews = data.articles.filter(article =>
        article.title.toLowerCase().includes('santé') ||
        article.description.toLowerCase().includes('santé')
      );
      setNews(filteredNews);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  const refreshNews = () => {
    setLoading(true);
    fetchNews();
  };

  if (loading) return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 100px)',
        mt: '100px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <CircularProgress size={50} thickness={4} sx={{ color: theme.palette.primary.main }} />
    </Box>
  );

  if (error) return (
    <Box 
      sx={{
        mt: '100px',
        p: 3,
        bgcolor: 'rgba(255, 0, 0, 0.1)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}
    >
      <Typography color="error" variant="h6">{error}</Typography>
    </Box>
  );

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        pt: '100px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 6,
            gap: 2
          }}
        >
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            Actualités Santé
          </Typography>
          <Button 
            variant="contained" 
            onClick={refreshNews}
            startIcon={<RefreshIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Actualiser
          </Button>
        </Box>

        {news.length === 0 ? (
          <Fade in>
            <Box 
              sx={{
                textAlign: 'center',
                p: 6,
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              }}
            >
              <AutorenewIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Aucune actualité disponible
              </Typography>
              <Typography color="text.secondary">
                Veuillez réessayer ultérieurement
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {news.map((item, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Fade in timeout={300 + index * 100}>
                  <Card 
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)'
                      }
                    }}
                  >
                    {item.urlToImage && (
                      <Box 
                        sx={{
                          position: 'relative',
                          paddingTop: '56.25%',
                          overflow: 'hidden'
                        }}
                      >
                        <img 
                          src={item.urlToImage} 
                          alt={item.title}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography 
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Button 
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          mt: 'auto',
                          borderRadius: '50px',
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            borderColor: theme.palette.primary.main
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Lire plus
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default NewsPage;