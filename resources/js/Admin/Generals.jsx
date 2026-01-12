import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

// Bibliotecas requeridas para Google Maps
const libraries = ["places"];
import { Toaster, toast } from "sonner";

// Asume que tienes un servicio para guardar los datos
import BaseAdminto from "../Components/Adminto/Base";
import GeneralsRest from "../Actions/Admin/GeneralsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import TinyMCEFormGroup from "../Components/Adminto/form/TinyMCEFormGroup";
import Global from "../Utils/Global";
import GalleryRest from "../Actions/Admin/GalleryRest";
import RepositoryRest from "../Actions/Admin/RepositoryRest";
import Tippy from "@tippyjs/react";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import { some } from "lodash";

const generalsRest = new GeneralsRest();
const galleryRest = new GalleryRest();
const repositoryRest = new RepositoryRest();

const Generals = ({ generals, allGenerals, session, hasRootRole: backendRootRole }) => {
  // Debug: Verificar si generals está cambiando constantemente
  useEffect(() => {
    //use efect not validate
  });

  // Función para verificar si el usuario tiene rol Root
  const hasRootRole = useCallback(() => {
    // Usar el valor del backend si está disponible, sino usar el método original
    if (typeof backendRootRole !== 'undefined') {
      return backendRootRole;
    }
    return session?.roles?.some(role => role.name === 'Root') || false;
  }, [backendRootRole, session]);

  // Memoizar generals para evitar re-renders constantes
  const visibleGenerals = useMemo(() => {
    // El backend ya filtra según el rol, usamos directamente los generals recibidos
    return generals;
  }, [generals]);

  // Función memoizada para verificar si un campo debe mostrarse
  const shouldShowField = useCallback((correlative) => {
    return visibleGenerals.some(general => general.correlative === correlative);
  }, [visibleGenerals]);



  // Mapeo de tabs a correlatives - COMPLETO para reflejar todos los tabs del formulario
  const tabCorrelatives = {
    'general': ['address', 'cintillo', 'copyright', 'opening_hours','header_menu_order', 'excel_import_template', 'footer_description', 'footer_company_links'],
    'email': ['purchase_summary_email', 'order_status_changed_email', 'blog_published_email', 'claim_email', 'whistleblowing_email', 'password_changed_email', 'reset_password_email', 'subscription_email', 'verify_account_email','message_contact_email','admin_purchase_email','admin_contact_email','admin_claim_email','admin_whistleblowing_email','job_application_email','admin_job_application_email'],
    'contact': ['phone_contact', 'email_contact', 'support_phone', 'support_email', 'coorporative_email', 'whatsapp_advisors'],
    'checkout': ['checkout_culqi', 'checkout_culqi_name', 'checkout_culqi_public_key', 'checkout_culqi_private_key', 'checkout_culqi_rsa_id', 'checkout_culqi_rsa_public_key', 'checkout_culqi_supports_usd', 'checkout_culqi_commission', 'checkout_mercadopago', 'checkout_mercadopago_name', 'checkout_mercadopago_public_key', 'checkout_mercadopago_private_key', 'checkout_mercadopago_commission', 'checkout_openpay', 'checkout_openpay_name', 'checkout_openpay_merchant_id', 'checkout_openpay_public_key', 'checkout_openpay_private_key', 'checkout_openpay_commission', 'checkout_openpay_sandbox_mode', 'checkout_dwallet', 'checkout_dwallet_qr', 'checkout_dwallet_name', 'checkout_dwallet_description', 'checkout_dwallet_commission', 'checkout_transfer', 'transfer_accounts', 'checkout_transfer_cci', 'checkout_transfer_name', 'checkout_transfer_description', 'checkout_transfer_commission'],
    'importation': ['importation_flete', 'importation_seguro', 'importation_derecho_arancelario', 'importation_derecho_arancelario_descripcion'],
    'policies': ['privacy_policy', 'terms_conditions', 'delivery_policy', 'saleback_policy', 'politica_sistema_gestion', 'alcance_sistema_gestion'],
    'location': ['location'],
    'shippingfree': ['shipping_free', 'igv_checkout', 'currency', 'exchange_rate_usd_pen', 'additional_shipping_costs'],
    'seo': ['site_title', 'site_description', 'site_keywords', 'og_title', 'og_description', 'og_image', 'og_url', 'twitter_title', 'twitter_description', 'twitter_image', 'twitter_card', 'favicon', 'canonical_url'],

    'pixels': ['google_analytics_id', 'google_tag_manager_id', 'facebook_pixel_id', 'google_ads_conversion_id', 'google_ads_conversion_label', 'tiktok_pixel_id', 'hotjar_id', 'clarity_id', 'linkedin_insight_tag', 'twitter_pixel_id', 'pinterest_tag_id', 'snapchat_pixel_id', 'custom_head_scripts', 'custom_body_scripts', 'atalaya_leads_api_key'],
    'oauth': ['google_client_id', 'google_client_secret', 'google_oauth_enabled']
  };

  // Función memoizada para verificar si un tab debe mostrarse
  const shouldShowTab = useCallback((tabName) => {
    const correlatives = tabCorrelatives[tabName];
    if (!correlatives) return true; // Si no está mapeado, siempre mostrar
    // Mostrar tab si al menos uno de sus campos está disponible
    return correlatives.some(correlative => shouldShowField(correlative));
  }, [shouldShowField]);

  // Componente ConditionalField memoizado usando useMemo
  const ConditionalField = useMemo(() => {
    return ({ correlative, children, fallback = null }) => {
      return shouldShowField(correlative) ? children : fallback;
    };
  }, [shouldShowField]);

  // Crear una referencia estable a la función shouldShowField
  const shouldShowFieldRef = useCallback((correlative) => {
    return shouldShowField(correlative);
  }, [shouldShowField]);

  const location =
    generals.find((x) => x.correlative == "location")?.description ?? "0,0";

  // Lista completa de plantillas de email que deben existir (para guardarlas)
  const allEmailTemplateCorrelatives = [
    'purchase_summary_email',
    'order_status_changed_email',
    'blog_published_email',
    'claim_email',
    'whistleblowing_email',
    'password_changed_email',
    'reset_password_email',
    'subscription_email',
    'verify_account_email',
    'message_contact_email',
    'admin_purchase_email',
    'admin_contact_email',
    'admin_claim_email',
    'admin_whistleblowing_email',
    'job_application_email',
    'admin_job_application_email'
  ];

  // Memoizar plantillas de email - solo las que existen (para mostrar en UI)
  const emailTemplates = useMemo(() => {
    return generals.filter(g => g.correlative.endsWith('_email') && g.correlative !== 'support_email' && g.correlative !== 'coorporative_email');
  }, [generals]);
  
  const [showPreview, setShowPreview] = useState(false);
  const [selectedEmailCorrelative, setSelectedEmailCorrelative] = useState("");
  const [templateVariables, setTemplateVariables] = useState({});
  const [loadingVars, setLoadingVars] = useState(false);
  const [varsError, setVarsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar selectedEmailCorrelative cuando emailTemplates esté disponible
  useEffect(() => {
    if (emailTemplates.length > 0 && !selectedEmailCorrelative) {
      setSelectedEmailCorrelative(emailTemplates[0].correlative);
    }
  }, [emailTemplates, selectedEmailCorrelative]);

  // Estados para gestión de visibilidad de campos
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({});
  const [savingVisibility, setSavingVisibility] = useState(false);

  // Estados para Google Places Autocomplete
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // Fetch variables for selected template
  useEffect(() => {
    if (!selectedEmailCorrelative) return;
    // Map correlatives to API types
    const correlativeToType = {
      purchase_summary_email: "purchase_summary",
      order_status_changed_email: "order_status_changed",
      blog_published_email: "blog_published",
      claim_email: "claim",
      password_changed_email: "password_changed",
      reset_password_email: "password_reset",
      subscription_email: "subscription",
      verify_account_email: "verify_account",
    };
    const type = correlativeToType[selectedEmailCorrelative];
    if (!type) {
      setTemplateVariables({});
      return;
    }
    setLoadingVars(true);
    setVarsError(null);
    fetch(`/api/notification-variables/${type}`)
      .then(res => res.json())
      .then(data => {
        setTemplateVariables(data.variables || {});
        setLoadingVars(false);
      })
      .catch(err => {
        setVarsError("No se pudieron cargar las variables.");
        setLoadingVars(false);
      });
  }, [selectedEmailCorrelative]);

  // Inicializar estado de visibilidad de campos
  useEffect(() => {
    if (hasRootRole()) {
      const visibility = {};
      
      // Inicializar desde allGenerals existentes
      if (allGenerals && allGenerals.length > 0) {
        allGenerals.forEach(general => {
          if (general && general.correlative) {
            visibility[general.correlative] = general.status === 1 || general.status === '1';
          }
        });
      }
      
      // Agregar campos SEO que siempre deben estar disponibles (por defecto habilitados)
      const seoFields = ['site_title', 'site_description', 'site_keywords', 'og_title', 'og_description', 'og_image', 'og_url', 'twitter_title', 'twitter_description', 'twitter_image', 'twitter_card', 'favicon', 'canonical_url'];
      seoFields.forEach(field => {
        // Si no existe en allGenerals, habilitarlo por defecto
        if (!(field in visibility)) {
          visibility[field] = true;
        }
      });
      
      setFieldVisibility(visibility);
    }
  }, [allGenerals, hasRootRole]);

  // Función para verificar si un campo SEO debe mostrarse
  const shouldShowSeoField = useCallback((correlative) => {
    // Para usuarios Root, siempre mostrar todos los campos
    if (hasRootRole()) return true;
    
    // Para usuarios Admin, verificar el estado de visibilidad
    // Si el campo no existe en fieldVisibility, asumir que está habilitado (campos nuevos)
    return fieldVisibility[correlative] !== false;
  }, [hasRootRole, fieldVisibility]);

  // Componente ConditionalSeoField para campos SEO
  const ConditionalSeoField = useMemo(() => {
    return ({ correlative, children, fallback = null }) => {
      return shouldShowSeoField(correlative) ? children : fallback;
    };
  }, [shouldShowSeoField]);

  const [formData, setFormData] = useState(() => ({
    // Incluir TODAS las plantillas de email (aunque no existan en generals)
    email_templates: Object.fromEntries(
      allEmailTemplateCorrelatives.map(correlative => {
        const existing = generals.find(g => g.correlative === correlative);
        return [correlative, existing?.description ?? ""];
      })
    ),
    phones: generals
      .find((x) => x.correlative == "phone_contact")
      ?.description?.split(",")
      ?.map((x) => x.trim()) ?? [""],
    emails: generals
      .find((x) => x.correlative == "email_contact")
      ?.description?.split(",")
      ?.map((x) => x.trim()) ?? [""],
    cintillos: (() => {
      const cintilloGeneral = generals.find((x) => x.correlative == "cintillo");
      if (!cintilloGeneral?.description) return [];
      
      try {
        // Intentar parsear como JSON primero (nuevo formato)
        const parsed = JSON.parse(cintilloGeneral.description);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        // Si falla, usar el formato antiguo (strings separados por comas)
        return cintilloGeneral.description
          .split(",")
          .map((x) => x.trim())
          .filter(x => x.length > 0);
      }
    })(),
    copyright:
      generals.find((x) => x.correlative == "copyright")?.description ??
      "",
    address:
      generals.find((x) => x.correlative == "address")?.description ?? "",
    openingHours:
      generals.find((x) => x.correlative == "opening_hours")
        ?.description ?? "",
    /*footerDescription:
      generals.find((x) => x.correlative == "footer_description")
        ?.description ?? "",*/
    supportPhone:
      generals.find((x) => x.correlative == "support_phone")
        ?.description ?? "",
    supportEmail:
      generals.find((x) => x.correlative == "support_email")
        ?.description ?? "",
    coorporativeEmail:
      generals.find((x) => x.correlative == "coorporative_email")
        ?.description ?? "",
    privacyPolicy:
      generals.find((x) => x.correlative == "privacy_policy")
        ?.description ?? "",
    termsConditions:
      generals.find((x) => x.correlative == "terms_conditions")
        ?.description ?? "",
    deliveryPolicy:
      generals.find((x) => x.correlative == "delivery_policy")
        ?.description ?? "",
    salebackPolicy:
      generals.find((x) => x.correlative == "saleback_policy")
        ?.description ?? "",
    politicaSistemaGestion:
      generals.find((x) => x.correlative == "politica_sistema_gestion")
        ?.description ?? "",
    alcanceSistemaGestion:
      generals.find((x) => x.correlative == "alcance_sistema_gestion")
        ?.description ?? "",
    excelImportTemplate:
      generals.find((x) => x.correlative == "excel_import_template")
        ?.description ?? "",
    headerMenuOrder:
      generals.find((x) => x.correlative == "header_menu_order")
        ?.description ?? "",
    whatsappAdvisors: (() => {
      const advisorsGeneral = generals.find((x) => x.correlative == "whatsapp_advisors");
      if (!advisorsGeneral?.description) return [];
      try {
        const parsed = JSON.parse(advisorsGeneral.description);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    })(),
    igvCheckout:
      generals.find((x) => x.correlative == "igv_checkout")
        ?.description ?? "",
    shippingFree:
      generals.find((x) => x.correlative == "shipping_free")
        ?.description ?? "",
    currency:
      generals.find((x) => x.correlative == "currency")
        ?.description ?? "",
    exchange_rate_usd_pen:
      generals.find((x) => x.correlative == "exchange_rate_usd_pen")
        ?.description ?? "3.75",
    additional_shipping_costs: (() => {
      const costs = generals.find((x) => x.correlative == "additional_shipping_costs");
      if (!costs?.description) return [];
      try {
        const parsed = JSON.parse(costs.description);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    })(),
    location: {
      lat: Number(location.split(",").map((x) => x.trim())[0]),
      lng: Number(location.split(",").map((x) => x.trim())[1]),
    },
    checkout_culqi: generals.find(x => x.correlative == 'checkout_culqi')?.description ?? "",
    checkout_culqi_name: generals.find(x => x.correlative == 'checkout_culqi_name')?.description ?? "",
    checkout_culqi_public_key: generals.find(x => x.correlative == 'checkout_culqi_public_key')?.description ?? "",
    checkout_culqi_private_key: generals.find(x => x.correlative == 'checkout_culqi_private_key')?.description ?? "",
    checkout_culqi_rsa_id: generals.find(x => x.correlative == 'checkout_culqi_rsa_id')?.description ?? "",
    checkout_culqi_rsa_public_key: generals.find(x => x.correlative == 'checkout_culqi_rsa_public_key')?.description ?? "",
    checkout_culqi_supports_usd: generals.find(x => x.correlative == 'checkout_culqi_supports_usd')?.description ?? "false",
    checkout_culqi_commission: generals.find(x => x.correlative == 'checkout_culqi_commission')?.description ?? "",
    checkout_mercadopago: generals.find(x => x.correlative == 'checkout_mercadopago')?.description ?? "",
    checkout_mercadopago_name: generals.find(x => x.correlative == 'checkout_mercadopago_name')?.description ?? "",
    checkout_mercadopago_public_key: generals.find(x => x.correlative == 'checkout_mercadopago_public_key')?.description ?? "",
    checkout_mercadopago_private_key: generals.find(x => x.correlative == 'checkout_mercadopago_private_key')?.description ?? "",
    checkout_mercadopago_commission: generals.find(x => x.correlative == 'checkout_mercadopago_commission')?.description ?? "",
    checkout_openpay: generals.find(x => x.correlative == 'checkout_openpay')?.description ?? "",
    checkout_openpay_name: generals.find(x => x.correlative == 'checkout_openpay_name')?.description ?? "",
    checkout_openpay_merchant_id: generals.find(x => x.correlative == 'checkout_openpay_merchant_id')?.description ?? "",
    checkout_openpay_public_key: generals.find(x => x.correlative == 'checkout_openpay_public_key')?.description ?? "",
    checkout_openpay_private_key: generals.find(x => x.correlative == 'checkout_openpay_private_key')?.description ?? "",
    checkout_openpay_commission: generals.find(x => x.correlative == 'checkout_openpay_commission')?.description ?? "",
    checkout_openpay_sandbox_mode: generals.find(x => x.correlative == 'checkout_openpay_sandbox_mode')?.description ?? "false",
    checkout_dwallet: generals.find(x => x.correlative == 'checkout_dwallet')?.description ?? "",
    checkout_dwallet_qr: generals.find(x => x.correlative == 'checkout_dwallet_qr')?.description ?? "",
    checkout_dwallet_name: generals.find(x => x.correlative == 'checkout_dwallet_name')?.description ?? "",
    checkout_dwallet_description: generals.find(x => x.correlative == 'checkout_dwallet_description')?.description ?? "",
    checkout_dwallet_commission: generals.find(x => x.correlative == 'checkout_dwallet_commission')?.description ?? "",
    checkout_transfer: generals.find(x => x.correlative == 'checkout_transfer')?.description ?? "",
    checkout_transfer_cci: generals.find(x => x.correlative == 'checkout_transfer_cci')?.description ?? "",
    checkout_transfer_name: generals.find(x => x.correlative == 'checkout_transfer_name')?.description ?? "",
    checkout_transfer_description: generals.find(x => x.correlative == 'checkout_transfer_description')?.description ?? "",
    checkout_transfer_commission: generals.find(x => x.correlative == 'checkout_transfer_commission')?.description ?? "",
    transfer_accounts: generals.find(x => x.correlative == 'transfer_accounts')?.description
      ? JSON.parse(generals.find(x => x.correlative == 'transfer_accounts')?.description)
      : [
        {
          image: null,
          cc: "",
          cci: "",
          name: "",
          description: ""
        }
      ],
    // Importation calculations
    importation_flete: generals.find(x => x.correlative == 'importation_flete')?.description ?? "",
    importation_seguro: generals.find(x => x.correlative == 'importation_seguro')?.description ?? "",
    importation_derecho_arancelario: generals.find(x => x.correlative == 'importation_derecho_arancelario')?.description ?? "",
    importation_derecho_arancelario_descripcion: generals.find(x => x.correlative == 'importation_derecho_arancelario_descripcion')?.description ?? "",
    // Píxeles de tracking
    googleAnalyticsId:
      generals.find((x) => x.correlative == "google_analytics_id")
        ?.description ?? "",
    googleTagManagerId:
      generals.find((x) => x.correlative == "google_tag_manager_id")
        ?.description ?? "",
    facebookPixelId:
      generals.find((x) => x.correlative == "facebook_pixel_id")
        ?.description ?? "",
    googleAdsConversionId:
      generals.find((x) => x.correlative == "google_ads_conversion_id")
        ?.description ?? "",
    googleAdsConversionLabel:
      generals.find((x) => x.correlative == "google_ads_conversion_label")
        ?.description ?? "",
    tiktokPixelId:
      generals.find((x) => x.correlative == "tiktok_pixel_id")
        ?.description ?? "",
    hotjarId:
      generals.find((x) => x.correlative == "hotjar_id")
        ?.description ?? "",
    clarityId:
      generals.find((x) => x.correlative == "clarity_id")
        ?.description ?? "",
    linkedinInsightTag:
      generals.find((x) => x.correlative == "linkedin_insight_tag")
        ?.description ?? "",
    twitterPixelId:
      generals.find((x) => x.correlative == "twitter_pixel_id")
        ?.description ?? "",
    pinterestTagId:
      generals.find((x) => x.correlative == "pinterest_tag_id")
        ?.description ?? "",
    snapchatPixelId:
      generals.find((x) => x.correlative == "snapchat_pixel_id")
        ?.description ?? "",
    customHeadScripts:
      generals.find((x) => x.correlative == "custom_head_scripts")
        ?.description ?? "",
    customBodyScripts:
      generals.find((x) => x.correlative == "custom_body_scripts")
        ?.description ?? "",
    atalayaLeadsApiKey:
      generals.find((x) => x.correlative == "atalaya_leads_api_key")
        ?.description ?? "",
    // Google OAuth Configuration
    googleClientId:
      generals.find((x) => x.correlative == "google_client_id")
        ?.description ?? "",
    googleClientSecret:
      generals.find((x) => x.correlative == "google_client_secret")
        ?.description ?? "",
    googleOauthEnabled:
      generals.find((x) => x.correlative == "google_oauth_enabled")
        ?.description ?? "false",
    
    // Campos SEO
    siteTitle:
      generals.find((x) => x.correlative == "site_title")
        ?.description ?? "",
    siteDescription:
      generals.find((x) => x.correlative == "site_description")
        ?.description ?? "",
    siteKeywords:
      generals.find((x) => x.correlative == "site_keywords")
        ?.description ?? "",
    ogTitle:
      generals.find((x) => x.correlative == "og_title")
        ?.description ?? "",
    ogDescription:
      generals.find((x) => x.correlative == "og_description")
        ?.description ?? "",
    ogImage:
      generals.find((x) => x.correlative == "og_image")
        ?.description ?? "",
    ogUrl:
      generals.find((x) => x.correlative == "og_url")
        ?.description ?? "",
    twitterTitle:
      generals.find((x) => x.correlative == "twitter_title")
        ?.description ?? "",
    twitterDescription:
      generals.find((x) => x.correlative == "twitter_description")
        ?.description ?? "",
    twitterImage:
      generals.find((x) => x.correlative == "twitter_image")
        ?.description ?? "",
    twitterCard:
      generals.find((x) => x.correlative == "twitter_card")
        ?.description ?? "summary_large_image",
    favicon:
      generals.find((x) => x.correlative == "favicon")
        ?.description ?? "",
    canonicalUrl:
      generals.find((x) => x.correlative == "canonical_url")
        ?.description ?? "",
    footerDescription:
      generals.find((x) => x.correlative == "footer_description")
        ?.description ?? "",
    footerCompanyLinks: (() => {
      try {
        const links = generals.find((x) => x.correlative == "footer_company_links")?.description;
        const parsed = links ? JSON.parse(links) : [];
        // Asegurar que cada enlace tenga el campo visible (por defecto true si no existe)
        return parsed.map(link => ({
          ...link,
          visible: link.visible !== undefined ? link.visible : true
        }));
      } catch {
        return [];
      }
    })(),
  }));

  // Funciones memoizadas para evitar re-renders y pérdida de foco
  const handleEmailTemplateChange = useCallback((content) => {
    setFormData(prev => ({
      ...prev,
      email_templates: {
        ...prev.email_templates,
        [selectedEmailCorrelative]: content
      }
    }));
  }, [selectedEmailCorrelative]);

  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCheckboxChange = useCallback((field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: String(checked)
    }));
  }, []);

  const handleNestedFieldChange = useCallback((field, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value
      }
    }));
  }, []);

  // Handlers específicos para cada campo para evitar recreación de funciones
  const handleCopyrightChange = useCallback((e) => {
    handleFieldChange('copyright', e.target.value);
  }, [handleFieldChange]);

  const handleAddressChange = useCallback((e) => {
    handleFieldChange('address', e.target.value);
  }, [handleFieldChange]);

  const handleOpeningHoursChange = useCallback((e) => {
    handleFieldChange('openingHours', e.target.value);
  }, [handleFieldChange]);

  const handleSupportPhoneChange = useCallback((e) => {
    handleFieldChange('supportPhone', e.target.value);
  }, [handleFieldChange]);

  const handleCoorporativeEmailChange = useCallback((e) => {
    handleFieldChange('coorporativeEmail', e.target.value);
  }, [handleFieldChange]);

  const handleSupportEmailChange = useCallback((e) => {
    handleFieldChange('supportEmail', e.target.value);
  }, [handleFieldChange]);

  const handlePhoneWhatsappChange = useCallback((e) => {
    handleFieldChange('phoneWhatsapp', e.target.value);
  }, [handleFieldChange]);

  const handleMessageWhatsappChange = useCallback((e) => {
    handleFieldChange('messageWhatsapp', e.target.value);
  }, [handleFieldChange]);

  // Handlers para checkboxes
  const handleCheckoutCulqiChange = useCallback((e) => {
    handleCheckboxChange('checkout_culqi', e.target.checked);
  }, [handleCheckboxChange]);

  const handleCheckoutMercadopagoChange = useCallback((e) => {
    handleCheckboxChange('checkout_mercadopago', e.target.checked);
  }, [handleCheckboxChange]);

  const handleCheckoutOpenpayChange = useCallback((e) => {
    handleCheckboxChange('checkout_openpay', e.target.checked);
  }, [handleCheckboxChange]);

  const handleOpenpayNameChange = useCallback((e) => {
    handleFieldChange('checkout_openpay_name', e.target.value);
  }, [handleFieldChange]);

  const handleOpenpayMerchantIdChange = useCallback((e) => {
    handleFieldChange('checkout_openpay_merchant_id', e.target.value);
  }, [handleFieldChange]);

  const handleOpenpayPublicKeyChange = useCallback((e) => {
    handleFieldChange('checkout_openpay_public_key', e.target.value);
  }, [handleFieldChange]);

  const handleOpenpayPrivateKeyChange = useCallback((e) => {
    handleFieldChange('checkout_openpay_private_key', e.target.value);
  }, [handleFieldChange]);

  const handleCheckoutDwalletChange = useCallback((e) => {
    handleCheckboxChange('checkout_dwallet', e.target.checked);
  }, [handleCheckboxChange]);

  const handleCheckoutTransferChange = useCallback((e) => {
    handleCheckboxChange('checkout_transfer', e.target.checked);
  }, [handleCheckboxChange]);

  // Handlers para campos específicos de pago
  const handleCulqiNameChange = useCallback((e) => {
    handleFieldChange('checkout_culqi_name', e.target.value);
  }, [handleFieldChange]);

  const handleCulqiPublicKeyChange = useCallback((e) => {
    handleFieldChange('checkout_culqi_public_key', e.target.value);
  }, [handleFieldChange]);

  const handleCulqiPrivateKeyChange = useCallback((e) => {
    handleFieldChange('checkout_culqi_private_key', e.target.value);
  }, [handleFieldChange]);

  const handleCulqiRsaIdChange = useCallback((e) => {
    handleFieldChange('checkout_culqi_rsa_id', e.target.value);
  }, [handleFieldChange]);

  const handleCulqiRsaPublicKeyChange = useCallback((e) => {
    handleFieldChange('checkout_culqi_rsa_public_key', e.target.value);
  }, [handleFieldChange]);

  const [activeTab, setActiveTab] = useState("general");
  const [showCintilloModal, setShowCintilloModal] = useState(false);
  const [editingCintillo, setEditingCintillo] = useState(null);
  const [modalCintillo, setModalCintillo] = useState({
    text: '',
    enabled: true,
    schedule: {
      monday: { enabled: true, start: '00:00', end: '23:59' },
      tuesday: { enabled: true, start: '00:00', end: '23:59' },
      wednesday: { enabled: true, start: '00:00', end: '23:59' },
      thursday: { enabled: true, start: '00:00', end: '23:59' },
      friday: { enabled: true, start: '00:00', end: '23:59' },
      saturday: { enabled: true, start: '00:00', end: '23:59' },
      sunday: { enabled: true, start: '00:00', end: '23:59' }
    }
  });

  // Funciones para gestión de visibilidad de campos
  const handleToggleFieldVisibility = (correlative) => {
    setFieldVisibility(prev => ({
      ...prev,
      [correlative]: !prev[correlative]
    }));
  };

  const handleSaveVisibility = async () => {
    setSavingVisibility(true);
    try {
      // Verificar que hay cambios que guardar
      if (Object.keys(fieldVisibility).length === 0) {
        toast.error("No hay campos para actualizar");
        return;
      }

      // Preparar los datos para enviar al servidor
      const visibilityUpdates = Object.entries(fieldVisibility).map(([correlative, isVisible]) => ({
        correlative,
        status: isVisible ? 1 : 0
      }));


      const response = await generalsRest.updateVisibility(visibilityUpdates);


      if (response.success) {
        //toast.success("Visibilidad de campos actualizada correctamente");
        setShowVisibilityModal(false);
        // Recargar la página para reflejar los cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.message || "Error al actualizar la visibilidad de campos");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error al actualizar la visibilidad de campos: " + error.message);
    } finally {
      setSavingVisibility(false);
    }
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const list = [...formData[field]];
    list[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      [field]: list,
    }));
  };

  const handleAddField = (field) => {
    if (field === 'cintillos') {
      // Para cintillos, agregar el objeto completo con programación
      const newCintillo = {
        text: '',
        enabled: true,
        schedule: {
          monday: { enabled: true, start: '00:00', end: '23:59' },
          tuesday: { enabled: true, start: '00:00', end: '23:59' },
          wednesday: { enabled: true, start: '00:00', end: '23:59' },
          thursday: { enabled: true, start: '00:00', end: '23:59' },
          friday: { enabled: true, start: '00:00', end: '23:59' },
          saturday: { enabled: true, start: '00:00', end: '23:59' },
          sunday: { enabled: true, start: '00:00', end: '23:59' }
        }
      };
      setFormData((prevState) => ({
        ...prevState,
        [field]: [...prevState[field], newCintillo],
      }));
    } else {
      // Para otros campos, mantener el comportamiento original
      setFormData((prevState) => ({
        ...prevState,
        [field]: [...prevState[field], ""],
      }));
    }
  };

  const handleRemoveField = (index, field) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      [field]: list,
    }));
  };

  const openCintilloModal = (index = null) => {
    if (index !== null) {
      // Editando cintillo existente
      const cintillo = formData.cintillos[index];
      if (typeof cintillo === 'string') {
        setModalCintillo({
          text: cintillo,
          enabled: true,
          schedule: {
            monday: { enabled: true, start: '00:00', end: '23:59' },
            tuesday: { enabled: true, start: '00:00', end: '23:59' },
            wednesday: { enabled: true, start: '00:00', end: '23:59' },
            thursday: { enabled: true, start: '00:00', end: '23:59' },
            friday: { enabled: true, start: '00:00', end: '23:59' },
            saturday: { enabled: true, start: '00:00', end: '23:59' },
            sunday: { enabled: true, start: '00:00', end: '23:59' }
          }
        });
      } else {
        setModalCintillo(cintillo);
      }
      setEditingCintillo(index);
    } else {
      // Nuevo cintillo
      setModalCintillo({
        text: '',
        enabled: true,
        schedule: {
          monday: { enabled: true, start: '00:00', end: '23:59' },
          tuesday: { enabled: true, start: '00:00', end: '23:59' },
          wednesday: { enabled: true, start: '00:00', end: '23:59' },
          thursday: { enabled: true, start: '00:00', end: '23:59' },
          friday: { enabled: true, start: '00:00', end: '23:59' },
          saturday: { enabled: true, start: '00:00', end: '23:59' },
          sunday: { enabled: true, start: '00:00', end: '23:59' }
        }
      });
      setEditingCintillo(null);
    }
    setShowCintilloModal(true);
  };

  const closeCintilloModal = () => {
    setShowCintilloModal(false);
    setEditingCintillo(null);
    setModalCintillo({
      text: '',
      enabled: true,
      schedule: {
        monday: { enabled: true, start: '00:00', end: '23:59' },
        tuesday: { enabled: true, start: '00:00', end: '23:59' },
        wednesday: { enabled: true, start: '00:00', end: '23:59' },
        thursday: { enabled: true, start: '00:00', end: '23:59' },
        friday: { enabled: true, start: '00:00', end: '23:59' },
        saturday: { enabled: true, start: '00:00', end: '23:59' },
        sunday: { enabled: true, start: '00:00', end: '23:59' }
      }
    });
  };

  const saveCintillo = () => {
    if (!modalCintillo.text.trim()) {
      alert('Por favor ingresa el texto del cintillo');
      return;
    }

    const newCintillos = [...formData.cintillos];
    
    if (editingCintillo !== null) {
      // Editando cintillo existente
      newCintillos[editingCintillo] = modalCintillo;
    } else {
      // Nuevo cintillo
      newCintillos.push(modalCintillo);
    }

    setFormData({
      ...formData,
      cintillos: newCintillos
    });

    closeCintilloModal();
  };

  const getActiveStatus = (cintillo) => {
    const text = typeof cintillo === 'string' ? cintillo : cintillo.text;
    const enabled = typeof cintillo === 'string' ? true : cintillo.enabled !== false;
    
    if (!enabled || !text?.trim()) return { status: 'Inactivo', class: 'badge bg-secondary' };
    
    if (typeof cintillo === 'string') return { status: 'Activo', class: 'badge bg-success' };
    
    if (!cintillo.schedule) return { status: 'Activo', class: 'badge bg-success' };
    
    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const daySchedule = cintillo.schedule[currentDay];
    
    if (!daySchedule || !daySchedule.enabled) return { status: 'Programado (Día no habilitado)', class: 'badge bg-warning' };
    
    const currentTime = now.toTimeString().slice(0, 5);
    const start = daySchedule.start || '00:00';
    const end = daySchedule.end || '23:59';
    
    const currentMinutes = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    
    let isActiveNow;
    if (endMinutes < startMinutes) {
      isActiveNow = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    } else {
      isActiveNow = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }
    
    if (isActiveNow) {
      return { status: 'Activo Ahora', class: 'badge bg-success' };
    } else {
      return { status: 'Programado (Fuera de horario)', class: 'badge bg-warning' };
    }
  };

  const getScheduleSummary = (cintillo) => {
    if (typeof cintillo === 'string') return 'Todos los días, todo el día';
    if (!cintillo.schedule) return 'Todos los días, todo el día';
    
    const dayNames = {
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mié',
      thursday: 'Jue',
      friday: 'Vie',
      saturday: 'Sáb',
      sunday: 'Dom'
    };
    
    const enabledDays = Object.entries(cintillo.schedule)
      .filter(([day, schedule]) => schedule.enabled)
      .map(([day]) => dayNames[day]);
    
    if (enabledDays.length === 0) return 'Ningún día';
    if (enabledDays.length === 7) return 'Todos los días';
    
    return enabledDays.join(', ');
  };

  const handleMapClick = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      location: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    }));
  };

  // Función para cargar el autocomplete
  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  // Función cuando se selecciona un lugar del autocomplete
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        
        setFormData((prevState) => ({
          ...prevState,
          location: newLocation,
        }));
        
        // Actualizar el valor del input de búsqueda
        setSearchValue(place.formatted_address || place.name || "");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return; // Prevenir múltiples envíos

    setIsLoading(true);

    // Construir la estructura de datos que espera el backend
    const dataToSend = [
      // Guardar todos los templates de email
      ...Object.keys(formData.email_templates).map(correlative => ({
        correlative,
        name: emailTemplates.find(t => t.correlative === correlative)?.name || correlative,
        description: formData.email_templates[correlative] || "",
      })),
      {
        correlative: "phone_contact",
        name: "Teléfono de contacto",
        description: formData.phones.join(","),
      },
      {
        correlative: "email_contact",
        name: "Correo de contacto",
        description: formData.emails.join(","),
      },
      {
        correlative: "address",
        name: "Dirección",
        description: formData.address || "",
      },
      {
        correlative: "cintillo",
        name: "Cintillo",
        description: JSON.stringify(formData.cintillos),
      },
      {
        correlative: "copyright",
        name: "Copyright",
        description: formData.copyright || "",
      },
      {
        correlative: "opening_hours",
        name: "Horarios de atención",
        description: formData.openingHours || "",
      },
      {
        correlative: "footer_description",
        name: "Descripción del Footer",
        description: formData.footerDescription || "",
      },
      {
        correlative: "footer_company_links",
        name: "Enlaces de Empresa (Footer)",
        description: JSON.stringify(formData.footerCompanyLinks || []),
      },
      {
        correlative: "support_phone",
        name: "Número de soporte",
        description: formData.supportPhone || "",
      },
      {
        correlative: "support_email",
        name: "Correo de soporte",
        description: formData.supportEmail || "",
      },
      {
        correlative: "coorporative_email",
        name: "Correo corporativo",
        description: formData.coorporativeEmail || "",
      },
      {
        correlative: "privacy_policy",
        name: "Política de privacidad",
        description: formData.privacyPolicy || "",
      },
      {
        correlative: "terms_conditions",
        name: "Términos y condiciones",
        description: formData.termsConditions || "",
      },
      {
        correlative: "delivery_policy",
        name: "Políticas de envío",
        description: formData.deliveryPolicy || "",
      },
      {
        correlative: "saleback_policy",
        name: "Políticas de devolucion y cambio",
        description: formData.salebackPolicy || "",
      },
      {
        correlative: "politica_sistema_gestion",
        name: "Política del sistema de Gestión",
        description: formData.politicaSistemaGestion || "",
      },
      {
        correlative: "alcance_sistema_gestion",
        name: "Alcance del sistema de Gestión",
        description: formData.alcanceSistemaGestion || "",
      },
      {
        correlative: "excel_import_template",
        name: "Plantilla de Importación Excel",
        description: formData.excelImportTemplate || "",
      },
      {
        correlative: "header_menu_order",
        name: "Orden del Menú del Header",
        description: formData.headerMenuOrder || "",
      },
      {
        correlative: "whatsapp_advisors",
        name: "Asesores de WhatsApp",
        description: JSON.stringify(formData.whatsappAdvisors || []),
      },
      {
        correlative: "igv_checkout",
        name: "IGV en el checkout",
        description: formData.igvCheckout || "",
      },
      {
        correlative: 'currency',
        name: 'Moneda',
        description: formData.currency || "",
      },
      {
        correlative: 'exchange_rate_usd_pen',
        name: 'Tipo de Cambio USD a PEN',
        description: formData.exchange_rate_usd_pen || "3.75",
      },
      {
        correlative: "shipping_free",
        name: "Envio gratis a partir de",
        description: formData.shippingFree || "",
      },
      {
        correlative: "importation_flete",
        name: "Flete",
        description: formData.importation_flete || "",
      },
      {
        correlative: "importation_seguro",
        name: "Seguro",
        description: formData.importation_seguro || "",
      },
      {
        correlative: "importation_derecho_arancelario",
        name: "Derecho arancelario",
        description: formData.importation_derecho_arancelario || "",
      },
      {
        correlative: "importation_derecho_arancelario_descripcion",
        name: "Descripción derecho arancelario",
        description: formData.importation_derecho_arancelario_descripcion || "",
      },
      {
        correlative: "checkout_culqi",
        name: "Habilitar Culqi",
        description: formData.checkout_culqi || "",
      },
      {
        correlative: 'checkout_culqi_name',
        name: 'Nombre de la cuenta de Culqi',
        description: formData.checkout_culqi_name || "",
      },
      {
        correlative: 'checkout_culqi_public_key',
        name: 'Llave pública de Culqi',
        description: formData.checkout_culqi_public_key || "",
      },
      {
        correlative: 'checkout_culqi_private_key',
        name: 'Llave privada de Culqi',
        description: formData.checkout_culqi_private_key || "",
      },
      {
        correlative: 'checkout_culqi_rsa_id',
        name: 'RSA ID de Culqi',
        description: formData.checkout_culqi_rsa_id || "",
      },
      {
        correlative: 'checkout_culqi_rsa_public_key',
        name: 'RSA Public Key de Culqi',
        description: formData.checkout_culqi_rsa_public_key || "",
      },
      {
        correlative: 'checkout_culqi_supports_usd',
        name: 'Culqi soporta USD',
        description: formData.checkout_culqi_supports_usd || "false",
      },
      {
        correlative: 'checkout_culqi_commission',
        name: 'Comisión Culqi (%)',
        description: formData.checkout_culqi_commission || "",
      },
      {
        correlative: "checkout_mercadopago",
        name: "Habilitar Mercadopago",
        description: formData.checkout_mercadopago || "",
      },
      {
        correlative: 'checkout_mercadopago_name',
        name: 'Nombre de la cuenta de Mercadopago',
        description: formData.checkout_mercadopago_name || "",
      },
      {
        correlative: 'checkout_mercadopago_public_key',
        name: 'Llave pública de Mercadopago',
        description: formData.checkout_mercadopago_public_key || "",
      },
      {
        correlative: 'checkout_mercadopago_private_key',
        name: 'Llave privada de Mercadopago',
        description: formData.checkout_mercadopago_private_key || "",
      },
      {
        correlative: 'checkout_mercadopago_commission',
        name: 'Comisión MercadoPago (%)',
        description: formData.checkout_mercadopago_commission || "",
      },
      {
        correlative: "checkout_openpay",
        name: "Habilitar OpenPay",
        description: formData.checkout_openpay || "",
      },
      {
        correlative: 'checkout_openpay_name',
        name: 'Nombre de la cuenta de OpenPay',
        description: formData.checkout_openpay_name || "",
      },
      {
        correlative: 'checkout_openpay_merchant_id',
        name: 'Merchant ID de OpenPay',
        description: formData.checkout_openpay_merchant_id || "",
      },
      {
        correlative: 'checkout_openpay_public_key',
        name: 'Llave pública de OpenPay',
        description: formData.checkout_openpay_public_key || "",
      },
      {
        correlative: 'checkout_openpay_private_key',
        name: 'Llave privada de OpenPay',
        description: formData.checkout_openpay_private_key || "",
      },
      {
        correlative: 'checkout_openpay_commission',
        name: 'Comisión OpenPay (%)',
        description: formData.checkout_openpay_commission || "",
      },
      {
        correlative: 'checkout_openpay_sandbox_mode',
        name: 'Modo Sandbox OpenPay',
        description: formData.checkout_openpay_sandbox_mode || "false",
      },
      {
        correlative: 'checkout_dwallet',
        name: 'Habilitar Yape/Plin',
        description: formData.checkout_dwallet || "",
      },
      {
        correlative: 'checkout_dwallet_qr',
        name: 'QR Yape/Plin',
        description: formData.checkout_dwallet_qr || "",
      },
      {
        correlative: 'checkout_dwallet_name',
        name: 'Título Yape/Plin',
        description: formData.checkout_dwallet_name || "",
      },
      {
        correlative: 'checkout_dwallet_description',
        name: 'Descripción Yape/Plin',
        description: formData.checkout_dwallet_description || "",
      },
      {
        correlative: 'checkout_dwallet_commission',
        name: 'Comisión Yape/Plin (%)',
        description: formData.checkout_dwallet_commission || "",
      },
      {
        correlative: 'checkout_transfer',
        name: 'Habilitar Transferencia',
        description: formData.checkout_transfer || "",
      },
      {
        correlative: "transfer_accounts",
        name: "Cuentas Bancarias para Transferencia",
        description: JSON.stringify(formData.transfer_accounts),
      },
      {
        correlative: 'checkout_transfer_cci',
        name: 'CCI Transferencia',
        description: formData.checkout_transfer_cci || "",
      },
      {
        correlative: 'checkout_transfer_name',
        name: 'Nombre Transferencia',
        description: formData.checkout_transfer_name || "",
      },
      {
        correlative: 'checkout_transfer_description',
        name: 'Descripción Transferencia',
        description: formData.checkout_transfer_description || "",
      },
      {
        correlative: 'checkout_transfer_commission',
        name: 'Comisión Transferencia (%)',
        description: formData.checkout_transfer_commission || "",
      },
      {
        correlative: "location",
        name: "Ubicación",
        description: `${formData.location.lat},${formData.location.lng}`,
      },
      // Píxeles de tracking
      {
        correlative: "google_analytics_id",
        name: "Google Analytics ID",
        description: formData.googleAnalyticsId || "",
      },
      {
        correlative: "google_tag_manager_id",
        name: "Google Tag Manager ID",
        description: formData.googleTagManagerId || "",
      },
      {
        correlative: "facebook_pixel_id",
        name: "Facebook Pixel ID",
        description: formData.facebookPixelId || "",
      },
      {
        correlative: "google_ads_conversion_id",
        name: "Google Ads Conversion ID",
        description: formData.googleAdsConversionId || "",
      },
      {
        correlative: "google_ads_conversion_label",
        name: "Google Ads Conversion Label",
        description: formData.googleAdsConversionLabel || "",
      },
      {
        correlative: "tiktok_pixel_id",
        name: "TikTok Pixel ID",
        description: formData.tiktokPixelId || "",
      },
      {
        correlative: "hotjar_id",
        name: "Hotjar ID",
        description: formData.hotjarId || "",
      },
      {
        correlative: "clarity_id",
        name: "Microsoft Clarity ID",
        description: formData.clarityId || "",
      },
      {
        correlative: "linkedin_insight_tag",
        name: "LinkedIn Insight Tag ID",
        description: formData.linkedinInsightTag || "",
      },
      {
        correlative: "twitter_pixel_id",
        name: "Twitter Pixel ID",
        description: formData.twitterPixelId || "",
      },
      {
        correlative: "pinterest_tag_id",
        name: "Pinterest Tag ID",
        description: formData.pinterestTagId || "",
      },
      {
        correlative: "snapchat_pixel_id",
        name: "Snapchat Pixel ID",
        description: formData.snapchatPixelId || "",
      },
      {
        correlative: "custom_head_scripts",
        name: "Scripts Personalizados (Head)",
        description: formData.customHeadScripts || "",
      },
      {
        correlative: "custom_body_scripts",
        name: "Scripts Personalizados (Body)",
        description: formData.customBodyScripts || "",
      },
      {
        correlative: "atalaya_leads_api_key",
        name: "Atalaya Leads API Key",
        description: formData.atalayaLeadsApiKey || "",
      },
      {
        correlative: "google_client_id",
        name: "Google Client ID",
        description: formData.googleClientId || "",
      },
      {
        correlative: "google_client_secret",
        name: "Google Client Secret",
        description: formData.googleClientSecret || "",
      },
      {
        correlative: "google_oauth_enabled",
        name: "Habilitar Google OAuth",
        description: formData.googleOauthEnabled || "",
      },
      // Culqi Configuration
      {
        correlative: "checkout_culqi",
        name: "Habilitar Culqi",
        description: formData.checkout_culqi || "",
      },
      {
        correlative: "checkout_culqi_name",
        name: "Nombre de la cuenta de Culqi",
        description: formData.checkout_culqi_name || "",
      },
      {
        correlative: "checkout_culqi_public_key",
        name: "Llave pública de Culqi",
        description: formData.checkout_culqi_public_key || "",
      },
      {
        correlative: "checkout_culqi_private_key",
        name: "Llave privada de Culqi",
        description: formData.checkout_culqi_private_key || "",
      },
      // Campos SEO
      {
        correlative: "site_title",
        name: "Título del Sitio",
        description: formData.siteTitle || "",
      },
      {
        correlative: "site_description",
        name: "Descripción del Sitio",
        description: formData.siteDescription || "",
      },
      {
        correlative: "site_keywords",
        name: "Palabras Clave",
        description: formData.siteKeywords || "",
      },
      {
        correlative: "og_title",
        name: "Título Open Graph",
        description: formData.ogTitle || "",
      },
      {
        correlative: "og_description",
        name: "Descripción Open Graph",
        description: formData.ogDescription || "",
      },
      {
        correlative: "og_image",
        name: "Imagen Open Graph",
        description: formData.ogImage || "",
      },
      {
        correlative: "og_url",
        name: "URL Open Graph",
        description: formData.ogUrl || "",
      },
      {
        correlative: "twitter_title",
        name: "Título Twitter",
        description: formData.twitterTitle || "",
      },
      {
        correlative: "twitter_description",
        name: "Descripción Twitter",
        description: formData.twitterDescription || "",
      },
      {
        correlative: "twitter_image",
        name: "Imagen Twitter",
        description: formData.twitterImage || "",
      },
      {
        correlative: "twitter_card",
        name: "Tipo Twitter Card",
        description: formData.twitterCard || "summary_large_image",
      },
      {
        correlative: "favicon",
        name: "Favicon",
        description: formData.favicon || "",
      },
      {
        correlative: "canonical_url",
        name: "URL Canónica",
        description: formData.canonicalUrl || "",
      },
      {
        correlative: "additional_shipping_costs",
        name: "Costos Adicionales de Envío",
        description: JSON.stringify(formData.additional_shipping_costs || []),
      },
    ];

    try {
      const result = await generalsRest.save(dataToSend);

      if (result) {
        // Las notificaciones se manejan automáticamente en BasicRest
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      // Los errores también se manejan automáticamente en BasicRest
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        {hasRootRole() && (
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title mb-0">Configuración General</h4>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowVisibilityModal(true)}
            >
              <i className="fas fa-eye me-1"></i>
              Gestionar Visibilidad
            </button>
          </div>
        )}
        <form className="card-body" onSubmit={handleSubmit}>
          <ul className="nav nav-tabs" id="contactTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "general" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("general")}
                type="button"
                role="tab"
              >
                Configuración general
              </button>
            </li>
            {shouldShowTab('contact') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "contact" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("contact")}
                  type="button"
                  role="tab"
                >
                  Información de Contacto
                </button>
              </li>
            )}
            {shouldShowTab('checkout') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "checkout" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("checkout")}
                  type="button"
                  role="tab"
                >
                  Métodos de Pago
                </button>
              </li>
            )}
            {shouldShowTab('importation') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "importation" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("importation")}
                  type="button"
                  role="tab"
                >
                  Cálculos de importación
                </button>
              </li>
            )}
            {shouldShowTab('policies') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "policies" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("policies")}
                  type="button"
                  role="tab"
                >
                  Políticas y Términos
                </button>
              </li>
            )}
            
              <ConditionalField correlative="cintillo">
                  <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "cintillos" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("cintillos")}
                type="button"
                role="tab"
              >
                Gestionar Cintillos
              </button>
            </li>
              </ConditionalField>
          

            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "location" ? "active" : ""
                  }`}
                onClick={() => setActiveTab("location")}
                type="button"
                role="tab"
              >
                Ubicación
              </button>
            </li>
  {shouldShowTab('email') && (
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "email" ? "active" : ""}`}
                onClick={() => setActiveTab("email")}
                type="button"
                role="tab"
              >
                Email
              </button>
            </li>
         )}
            
            {shouldShowTab('shippingfree') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "shippingfree" ? "active" : ""}`}
                  onClick={() => setActiveTab("shippingfree")}
                  type="button"
                  role="tab"
                >
                  Envio y Facturación
                </button>
              </li>
            )}

            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "seo" ? "active" : ""}`}
                onClick={() => setActiveTab("seo")}
                type="button"
                role="tab"
              >
                SEO & Meta Tags
              </button>
            </li>

            {shouldShowTab('pixels') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "pixels" ? "active" : ""}`}
                  onClick={() => setActiveTab("pixels")}
                  type="button"
                  role="tab"
                >
                  Píxeles & Analytics
                </button>
              </li>
            )}
            {shouldShowTab('oauth') && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "oauth" ? "active" : ""}`}
                  onClick={() => setActiveTab("oauth")}
                  type="button"
                  role="tab"
                >
                  OAuth & Autenticación
                </button>
              </li>
            )}

          </ul>

          <div className="tab-content">
            {/* Tab de Email */}
            <div
              className={`tab-pane fade ${activeTab === "email" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="mb-2">
                <label htmlFor="email_correlative" className="form-label">
                  Tipo de Email
                </label>
                <select
                  id="email_correlative"
                  className="form-select mb-3"
                  value={selectedEmailCorrelative}
                  onChange={e => setSelectedEmailCorrelative(e.target.value)}
                >
                  {emailTemplates.map(t => (
                    <option key={t.correlative} value={t.correlative}>{t.name || t.correlative}</option>
                  ))}
                </select>
                <TinyMCEFormGroup
                  height={600}
                  label={
                    <>
                      Plantilla de Email (HTML seguro, variables: <code>{`{{variable}}`}</code>)
                      <small className="d-block text-muted">
                        No se permite código PHP ni Blade. Solo variables seguras.<br />
                        {loadingVars && <span>Cargando variables...</span>}
                        {varsError && <span className="text-danger">{varsError}</span>}
                        {!loadingVars && !varsError && (
                          <>
                            <b>Variables disponibles:</b>{" "}
                            {Object.keys(templateVariables).length === 0
                              ? <span>No hay variables para esta notificación.</span>
                              : Object.entries(templateVariables).map(([key, desc]) => (
                                <span key={key} style={{ display: 'inline-block', marginRight: 8 }}>
                                  <code>{`{{${key}}}`}</code> <span className="text-muted">({desc})</span>{" "}
                                </span>
                              ))
                            }
                          </>
                        )}
                      </small>
                    </>
                  }
                  value={formData.email_templates[selectedEmailCorrelative] || ""}
                  onChange={handleEmailTemplateChange}
                />
              </div>
            </div>
            <div
              className={`tab-pane fade ${activeTab === "general" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row">
                   <ConditionalField correlative="cintillo">
                     <div className="col-md-6 mb-2">
                  <div className="alert alert-info">
                    <h6>
                      <i className="fas fa-info-circle me-2"></i>
                      Gestión de Cintillos
                    </h6>
                    <p className="mb-2">
                      Los cintillos se han movido a una pestaña dedicada para una mejor organización.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveTab("cintillos")}
                    >
                      <i className="fas fa-cog me-1"></i>
                      Ir a Gestionar Cintillos
                    </button>
                  </div>
                </div>
                   </ConditionalField>
               
                <ConditionalField correlative="copyright">
                  <div className={`mb-2 ${shouldShowField("cintillo") ? "col-md-6 " : "col-md-12 "}`}>
                    <label htmlFor="copyright" className="form-label">
                      Copyright
                    </label>
                    <textarea
                      className="form-control"
                      id="copyright"
                      value={formData.copyright}
                      onChange={handleCopyrightChange}
                    ></textarea>
                  </div>
                </ConditionalField>
              </div>
              {shouldShowField("address") && (
                <div className="mb-2">
                  <label htmlFor="address" className="form-label">
                    Dirección
                  </label>
                  <textarea
                    className="form-control"
                    id="address"
                    value={formData.address}
                    onChange={handleAddressChange}
                    required
                  ></textarea>
                </div>
              )}
              <ConditionalField correlative="opening_hours">
                <div className="mb-2">
                  <TextareaFormGroup
                    label="Horarios de atencion"
                    onChange={handleOpeningHoursChange}
                    value={formData.openingHours}
                    required
                  />
                </div>
              </ConditionalField>

              {/* Campo para subir plantilla de Excel para importación */}
              <ConditionalField correlative="excel_import_template">
                <div className="mb-2">
                  <label className="form-label">
                    <i className="fas fa-file-excel me-2 text-success"></i>
                    Plantilla de Importación de Productos (Excel)
                  </label>
                  {formData.excelImportTemplate ? (
                    <div className="position-relative">
                      <Tippy content="Eliminar plantilla">
                        <button
                          type="button"
                          className="position-absolute btn btn-xs btn-danger"
                          style={{ top: '5px', left: '5px', zIndex: 10 }}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              excelImportTemplate: ""
                            });
                          }}
                        >
                          <i className="mdi mdi-delete"></i>
                        </button>
                      </Tippy>
                      <div className="d-flex align-items-center p-3 border rounded bg-light">
                        <i className="mdi mdi-file-excel text-success me-2" style={{ fontSize: '2rem' }}></i>
                        <div className="flex-grow-1">
                          <strong>Plantilla Excel cargada</strong>
                          <br />
                          <small className="text-muted">{formData.excelImportTemplate}</small>
                        </div>
                        <a
                          href={`/cloud/${formData.excelImportTemplate}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-success"
                          download
                        >
                          <i className="mdi mdi-download"></i> Descargar
                        </a>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="file"
                      className="form-control"
                      accept=".xlsx,.xls"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        // Validar que sea Excel
                        if (!file.name.match(/\.(xlsx|xls)$/i)) {
                          alert('Por favor, selecciona solo archivos Excel (.xlsx o .xls)');
                          e.target.value = null;
                          return;
                        }
                        
                        e.target.value = null;

                        const request = new FormData();
                        request.append('file', file);
                        request.append('name', `plantilla-importacion-productos.xlsx`);

                        const result = await repositoryRest.save(request);
                        if (!result) return;

                        // Guardar el UUID del archivo devuelto por la API
                        setFormData({
                          ...formData,
                          excelImportTemplate: result.file
                        });
                      }}
                    />
                  )}
                  <small className="text-muted">
                    Esta plantilla se descargará desde el modal de importación en Items. Solo archivos Excel (.xlsx, .xls)
                  </small>
                </div>
              </ConditionalField>

              {/* Campo para orden del menú del header */}
              <ConditionalField correlative="header_menu_order">
                <div className="mb-2">
                  <label className="form-label">
                    <i className="fas fa-bars me-2"></i>
                    Orden del Menú del Header
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.headerMenuOrder}
                    onChange={(e) => handleFieldChange('headerMenuOrder', e.target.value)}
                    placeholder="Ej: Maquinarias,Grúas,Servicios,Nosotros"
                  />
                  <small className="text-muted">
                    Nombres de categorías y páginas separados por comas. Use los nombres exactos como aparecen en el menú.
                  </small>
                </div>
              </ConditionalField>

              <ConditionalField correlative="footer_description">
                <div className="mb-2">
                  <TextareaFormGroup
                    label="Descripción del Footer"
                    onChange={(e) => handleFieldChange('footerDescription', e.target.value)}
                    value={formData.footerDescription}
                    placeholder="Descripción que aparecerá en el footer del sitio web"
                    rows={3}
                  />
                </div>
              </ConditionalField>

              <ConditionalField correlative="footer_company_links">
                <div className="mb-2">
                  <label className="form-label d-block">
                    <i className="fas fa-link me-2"></i>
                    Enlaces de Empresa (Footer)
                  </label>
                  {formData.footerCompanyLinks.map((link, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-5 mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre del enlace"
                              value={link.name || ''}
                              onChange={(e) => {
                                const newLinks = [...formData.footerCompanyLinks];
                                newLinks[index] = { ...newLinks[index], name: e.target.value };
                                handleFieldChange('footerCompanyLinks', newLinks);
                              }}
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="URL del enlace (ej: /nosotros)"
                              value={link.href || ''}
                              onChange={(e) => {
                                const newLinks = [...formData.footerCompanyLinks];
                                newLinks[index] = { ...newLinks[index], href: e.target.value };
                                handleFieldChange('footerCompanyLinks', newLinks);
                              }}
                            />
                          </div>
                          <div className="col-md-1 d-flex gap-1">
                            <button
                              type="button"
                              className={`btn btn-sm flex-fill ${
                                link.visible !== false ? 'btn-success' : 'btn-secondary'
                              }`}
                              onClick={() => {
                                const newLinks = [...formData.footerCompanyLinks];
                                newLinks[index] = { 
                                  ...newLinks[index], 
                                  visible: !(link.visible !== false) 
                                };
                                handleFieldChange('footerCompanyLinks', newLinks);
                              }}
                              title={link.visible !== false ? 'Visible' : 'Oculto'}
                            >
                              <i className={`fa ${
                                link.visible !== false ? 'fa-eye' : 'fa-eye-slash'
                              }`}></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm flex-fill"
                              onClick={() => {
                                const newLinks = formData.footerCompanyLinks.filter((_, i) => i !== index);
                                handleFieldChange('footerCompanyLinks', newLinks);
                              }}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary d-bolck"
                    onClick={() => {
                      const newLinks = [...formData.footerCompanyLinks, { name: '', href: '', visible: true }];
                      handleFieldChange('footerCompanyLinks', newLinks);
                    }}
                  >
                    <i className="fa fa-plus me-1"></i>
                    Agregar enlace
                  </button>
                  <small className="text-muted d-block mt-2">
                    Estos enlaces aparecerán en la sección del footer
                  </small>
                </div>
              </ConditionalField>

            </div>

            {/* Tab de Contacto */}
            <div
              className={`tab-pane fade ${activeTab === "contact" ? "show active" : ""}`}
              role="tabpanel"
            >

              <div className="row mb-2">
                <ConditionalField correlative="phone_contact">
                  <div className="col-md-6">
                    {formData.phones.map((phone, index) => (
                      <div
                        key={`phone-${index}`}
                        className="mb-3"
                      >
                        <label
                          htmlFor={`phone-${index}`}
                          className="form-label"
                        >
                          Teléfono {index + 1}
                        </label>
                        <div className="input-group">
                          <input
                            type="tel"
                            className="form-control"
                            id={`phone-${index}`}
                            value={phone}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                index,
                                "phones"
                              )
                            }
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleRemoveField(
                                index,
                                "phones"
                              )
                            }
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleAddField("phones")}
                    >
                      Agregar teléfono
                    </button>
                  </div>
                </ConditionalField>
                <ConditionalField correlative="email_contact">
                  <div className="col-md-6">
                    {formData.emails.map((email, index) => (
                      <div
                        key={`email-${index}`}
                        className="mb-3"
                      >
                        <label
                          htmlFor={`email-${index}`}
                          className="form-label"
                        >
                          Correo {index + 1}
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            id={`email-${index}`}
                            value={email}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                index,
                                "emails"
                              )
                            }
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleRemoveField(
                                index,
                                "emails"
                              )
                            }
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleAddField("emails")}
                    >
                      Agregar correo
                    </button>
                  </div>

                </ConditionalField>
              </div>

              <ConditionalField correlative="support_phone">
                <div className="mb-2">
                  <label
                    htmlFor="supportPhone"
                    className="form-label"
                  >
                    Número de soporte
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="supportPhone"
                    value={formData.supportPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supportPhone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </ConditionalField>
              <ConditionalField correlative="coorporative_email">
                <div className="mb-2">
                  <label
                    htmlFor="coorporativeEmail"
                    className="form-label"
                  >
                    Correo corporativo (aquí llegaran los emails  salientes)
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="coorporativeEmail"
                    value={formData.coorporativeEmail}
                    onChange={handleCoorporativeEmailChange}
                  />
                </div>
              </ConditionalField>
              <ConditionalField correlative="support_email">
                <div className="mb-2">
                  <label
                    htmlFor="supportEmail"
                    className="form-label"
                  >
                    Correo de soporte
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleSupportEmailChange}
                    required
                  />
                </div>
              </ConditionalField>

              {/* Sección de Asesores de WhatsApp */}
              <div className="card mt-3" style={{ backgroundColor: "#e3f2fd", padding: "16px" }}>
                <h6 className="mb-3">
                  <i className="mdi mdi-account-multiple me-2"></i>
                  Asesores de WhatsApp
                </h6>
                <p className="text-muted small mb-3">
                  Agrega múltiples asesores. Si hay más de uno, se mostrará un modal para que el cliente elija.
                </p>
                
                {formData.whatsappAdvisors?.map((advisor, index) => (
                  <div key={index} className="card mb-3" style={{ padding: "12px", backgroundColor: "#fff" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Asesor #{index + 1}</h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          const newAdvisors = formData.whatsappAdvisors.filter((_, i) => i !== index);
                          setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                        }}
                      >
                        <i className="mdi mdi-delete"></i>
                      </button>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label small">Nombre del Asesor</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Ej: Romer Palacio"
                          value={advisor.name || ''}
                          onChange={(e) => {
                            const newAdvisors = [...formData.whatsappAdvisors];
                            newAdvisors[index].name = e.target.value;
                            setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                          }}
                        />
                      </div>
                      
                      <div className="col-md-6 mb-2">
                        <label className="form-label small">Puesto/Cargo</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Ej: Asesor de Ventas"
                          value={advisor.position || ''}
                          onChange={(e) => {
                            const newAdvisors = [...formData.whatsappAdvisors];
                            newAdvisors[index].position = e.target.value;
                            setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                          }}
                        />
                      </div>
                      
                      <div className="col-md-6 mb-2">
                        <label className="form-label small">Número de WhatsApp</label>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          placeholder="+51999999999"
                          value={advisor.phone || ''}
                          onChange={(e) => {
                            const newAdvisors = [...formData.whatsappAdvisors];
                            newAdvisors[index].phone = e.target.value;
                            setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                          }}
                        />
                      </div>
                      
                      <div className="col-md-6 mb-2">
                        <label className="form-label small">Mensaje Inicial</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="¡Hola! Necesito información"
                          value={advisor.message || ''}
                          onChange={(e) => {
                            const newAdvisors = [...formData.whatsappAdvisors];
                            newAdvisors[index].message = e.target.value;
                            setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                          }}
                        />
                      </div>
                      
                      <div className="col-12 mb-2">
                        <label className="form-label small">Foto del Asesor</label>
                        {advisor.photo ? (
                          <div className="position-relative ">
                            <Tippy content="Eliminar foto">
                              <button 
                                type="button"
                                className="position-absolute btn btn-xs btn-danger" 
                                style={{ top: '5px', left: '5px', zIndex: 10 }}
                                onClick={() => {
                                  const newAdvisors = [...formData.whatsappAdvisors];
                                  newAdvisors[index].photo = null;
                                  setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                                }}
                              >
                                <i className="mdi mdi-delete"></i>
                              </button>
                            </Tippy>
                            <img 
                              src={`/assets/resources/${advisor.photo}`} 
                              alt={advisor.name}
                              className="img-thumbnail"
                              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                          </div>
                        ) : (
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              e.target.value = null;

                              const ext = file.name.split('.').pop();
                              const imageName = `whatsapp-advisor-${index + 1}.${ext}`;

                              const request = new FormData();
                              request.append('image', file);
                              request.append('name', imageName);

                              const result = await galleryRest.save(request);
                              if (!result) return;

                              const newAdvisors = [...formData.whatsappAdvisors];
                              newAdvisors[index].photo = imageName;
                              setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    const newAdvisors = [
                      ...(formData.whatsappAdvisors || []),
                      { name: '', phone: '', message: '', photo: null, position: '' }
                    ];
                    setFormData({ ...formData, whatsappAdvisors: newAdvisors });
                  }}
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Agregar Asesor
                </button>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "checkout" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row">
                <div className="col-sm-3">
                  <div className="nav flex-column nav-pills nav-pills-tab" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    {some(generals, (general) => general.correlative === "checkout_culqi") && (
                      <a className="nav-link active show mb-1" id="v-culqi-tab" data-bs-toggle="pill" href="#v-culqi" role="tab" aria-controls="v-culqi" aria-selected="true">
                        Culqi
                      </a>
                    )}
                    {some(generals, (general) => general.correlative === "checkout_mercadopago") && (
                      <a className="nav-link mb-1" id="v-mercadopago-tab" data-bs-toggle="pill" href="#v-mercadopago" role="tab" aria-controls="v-mercadopago" aria-selected="false">
                        Mercado Pago
                      </a>
                    )}
                    {some(generals, (general) => general.correlative === "checkout_openpay") && (
                      <a className="nav-link mb-1" id="v-openpay-tab" data-bs-toggle="pill" href="#v-openpay" role="tab" aria-controls="v-openpay" aria-selected="false">
                        OpenPay
                      </a>
                    )}
                    {some(generals, (general) => general.correlative === "checkout_dwallet") && (
                      <a className="nav-link mb-1" id="v-digital-wallet-tab" data-bs-toggle="pill" href="#v-digital-wallet" role="tab" aria-controls="v-digital-wallet" aria-selected="false">
                        Yape / Plin
                      </a>
                    )}
                    {some(generals, (general) => general.correlative === "checkout_transfer") && (
                      <a className="nav-link mb-1" id="v-transfer-tab" data-bs-toggle="pill" href="#v-transfer" role="tab" aria-controls="v-transfer" aria-selected="false">
                        Transferencia
                      </a>
                    )}
                  </div>
                </div>
                <div className="tab-content col-sm-9">
                  <ConditionalField correlative="checkout_culqi">
                    <div className="tab-pane fade active show" id="v-culqi" role="tabpanel" aria-labelledby="v-culqi-tab">
                      <ConditionalField correlative="checkout_culqi">
                        <div className="mb-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="checkout-culqi"
                              checked={formData.checkout_culqi == 'true'}
                              onChange={handleCheckoutCulqiChange}
                            />
                            <label className="form-check-label form-label" htmlFor="checkout-culqi">
                              Habilitar pago con Culqi
                              <small className="text-muted d-block">Al habilitar esta opción, permite pagos por Culqi </small>
                            </label>
                          </div>
                        </div>
                      </ConditionalField>
                      <ConditionalField correlative="checkout_culqi_name">
                        <div className="mb-2">
                          <label className="form-label">Título del formulario</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.checkout_culqi_name}
                            onChange={handleCulqiNameChange}
                          />
                        </div>
                      </ConditionalField>
                      <div className="mb-2">
                        <label className="form-label">Clave Pública</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.checkout_culqi_public_key}
                          onChange={handleCulqiPublicKeyChange}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Clave Privada</label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.checkout_culqi_private_key}
                          onChange={handleCulqiPrivateKeyChange}
                        />
                      </div>
                      <div className="mt-4 mb-2" hidden>
                        <h6 className="text-muted">Configuración RSA (Custom Checkout v4)</h6>
                        <small className="text-muted d-block mb-2">Estas claves RSA son necesarias para el nuevo Custom Checkout de Culqi. Obténlas desde el panel de Culqi en la sección de claves RSA.</small>
                      </div>
                      <div className="mb-2" hidden>
                        <label className="form-label">RSA ID</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ej: 12345678-abcd-1234-efgh-123456789012"
                          value={formData.checkout_culqi_rsa_id}
                          onChange={handleCulqiRsaIdChange}
                        />
                      </div>
                      <div className="mb-2" hidden>
                        <label className="form-label">RSA Public Key</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="-----BEGIN PUBLIC KEY-----&#10;MIGfMA0GCSqGSIb3DQEBAQUAA4GN...&#10;-----END PUBLIC KEY-----"
                          value={formData.checkout_culqi_rsa_public_key}
                          onChange={handleCulqiRsaPublicKeyChange}
                        />
                        <small className="text-muted">Copia la clave RSA pública completa desde el panel de Culqi</small>
                      </div>
                      <div className="mt-4 mb-2">
                        <h6 className="text-muted">Configuración de Moneda</h6>
                        <small className="text-muted d-block mb-2">Configura si tu cuenta de Culqi soporta pagos en dólares (USD).</small>
                      </div>
                      <div className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkout-culqi-supports-usd"
                            checked={formData.checkout_culqi_supports_usd === 'true'}
                            onChange={(e) => setFormData({ ...formData, checkout_culqi_supports_usd: String(e.target.checked) })}
                          />
                          <label className="form-check-label form-label" htmlFor="checkout-culqi-supports-usd">
                            Mi cuenta Culqi soporta USD
                            <small className="text-muted d-block">Si tienes una cuenta en dólares en Culqi, activa esta opción para procesar pagos directamente en USD sin conversión a soles.</small>
                          </label>
                        </div>
                      </div>
                      <div className="mt-4 mb-2">
                        <h6 className="text-muted">Comisión del Método de Pago</h6>
                        <small className="text-muted d-block mb-2">Configura la comisión (en porcentaje) que se añadirá al total cuando el cliente elija este método de pago.</small>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Comisión (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="Ej: 3.5"
                          value={formData.checkout_culqi_commission}
                          onChange={(e) => setFormData({ ...formData, checkout_culqi_commission: e.target.value })}
                        />
                        <small className="text-muted">Dejar en 0 si no desea aplicar comisión. Ejemplo: 3.5 = 3.5%</small>
                      </div>
                    </div>
                  </ConditionalField>
                  <ConditionalField correlative="checkout_mercadopago">
                    <div className="tab-pane fade" id="v-mercadopago" role="tabpanel" aria-labelledby="v-mercadopago-tab">
                      <div className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkout-mercadopago"
                            checked={formData.checkout_mercadopago == 'true'}
                            onChange={handleCheckoutMercadopagoChange}
                          />
                          <label className="form-check-label form-label" htmlFor="checkout-mercadopago">
                            Habilitar pago con Mercado Pago
                            <small className="text-muted d-block">Al habilitar esta opción, permite pagos por Mercado Pago </small>
                          </label>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Título del formulario</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.checkout_mercadopago_name}
                          onChange={(e) => setFormData({
                            ...formData,
                            checkout_mercadopago_name: e.target.value
                          })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Clave Pública</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.checkout_mercadopago_public_key}
                          onChange={(e) => setFormData({
                            ...formData,
                            checkout_mercadopago_public_key: e.target.value
                          })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Clave Privada (Access Token)</label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.checkout_mercadopago_private_key}
                          onChange={(e) => setFormData({
                            ...formData,
                            checkout_mercadopago_private_key: e.target.value
                          })}
                        />
                      </div>
                      <div className="mt-4 mb-2">
                        <h6 className="text-muted">Comisión del Método de Pago</h6>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Comisión (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="Ej: 3.5"
                          value={formData.checkout_mercadopago_commission}
                          onChange={(e) => setFormData({ ...formData, checkout_mercadopago_commission: e.target.value })}
                        />
                        <small className="text-muted">Dejar en 0 si no desea aplicar comisión</small>
                      </div>
                    </div>
                  </ConditionalField>
                  <ConditionalField correlative="checkout_openpay">
                    <div className="tab-pane fade" id="v-openpay" role="tabpanel" aria-labelledby="v-openpay-tab">
                      <div className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkout-openpay"
                            checked={formData.checkout_openpay == 'true'}
                            onChange={handleCheckoutOpenpayChange}
                          />
                          <label className="form-check-label form-label" htmlFor="checkout-openpay">
                            Habilitar pago con OpenPay
                            <small className="text-muted d-block">Al habilitar esta opción, permite pagos por OpenPay (tarjetas de crédito/débito)</small>
                          </label>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkout-openpay-sandbox"
                            checked={formData.checkout_openpay_sandbox_mode == 'true'}
                            onChange={(e) => setFormData({ ...formData, checkout_openpay_sandbox_mode: String(e.target.checked) })}
                          />
                          <label className="form-check-label form-label" htmlFor="checkout-openpay-sandbox">
                            Modo Sandbox (Pruebas)
                            <small className="text-muted d-block">Activar solo para pruebas. Desactivar en producción para procesar pagos reales.</small>
                          </label>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Título del formulario</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.checkout_openpay_name}
                          onChange={handleOpenpayNameChange}
                          placeholder="Pago con tarjeta"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Merchant ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.checkout_openpay_merchant_id}
                          onChange={handleOpenpayMerchantIdChange}
                          placeholder="mxxxxxxxxxxx"
                        />
                        <small className="text-muted">El Merchant ID proporcionado por OpenPay</small>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Clave Pública</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.checkout_openpay_public_key}
                          onChange={handleOpenpayPublicKeyChange}
                          placeholder="pk_xxxxxxxxxxxxx"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Clave Privada</label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.checkout_openpay_private_key}
                          onChange={handleOpenpayPrivateKeyChange}
                          placeholder="sk_xxxxxxxxxxxxx"
                        />
                      </div>
                      <div className="mt-4 mb-2">
                        <h6 className="text-muted">Comisión del Método de Pago</h6>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Comisión (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="Ej: 3.5"
                          value={formData.checkout_openpay_commission}
                          onChange={(e) => setFormData({ ...formData, checkout_openpay_commission: e.target.value })}
                        />
                        <small className="text-muted">Dejar en 0 si no desea aplicar comisión</small>
                      </div>
                      <div className="alert alert-info mt-3">
                        <h6><i className="mdi mdi-information me-2"></i>Configuración de OpenPay</h6>
                        <ul className="mb-0">
                          <li>Obtenga sus credenciales desde el <a href="https://dashboard.openpay.mx/" target="_blank" rel="noopener noreferrer">Dashboard de OpenPay</a></li>
                          <li>Use credenciales de <strong>producción</strong> para transacciones reales</li>
                          <li>Use credenciales de <strong>sandbox</strong> para pruebas</li>
                          <li>OpenPay acepta tarjetas Visa, Mastercard y American Express</li>
                        </ul>
                      </div>
                    </div>
                  </ConditionalField>
                  <ConditionalField correlative="checkout_dwallet">
                    <div className="tab-pane fade" id="v-digital-wallet" role="tabpanel" aria-labelledby="v-digital-wallet-tab">
                      <div className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkout-dwallet"
                            checked={formData.checkout_dwallet == 'true'}
                            onChange={(e) => setFormData({ ...formData, checkout_dwallet: String(e.target.checked) })}
                          />
                          <label className="form-check-label form-label" htmlFor="checkout-dwallet">
                            Habilitar pago con Yape/Plin
                            <small className="text-muted d-block">Al habilitar esta opción, permite pagos por Yape/Plin </small>
                          </label>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">QR</label>
                        {
                          formData.checkout_dwallet_qr
                            ? <div className="position-relative">
                              <Tippy content="Eliminar QR">
                                <button className="position-absolute btn btn-xs btn-danger" style={{
                                  top: '5px',
                                  left: '5px'
                                }} onClick={() => setFormData({
                                  ...formData,
                                  checkout_dwallet_qr: null
                                })}>
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </Tippy>
                              <img src={`/assets/resources/${formData.checkout_dwallet_qr}`} className="img-thumbnail" style={{
                                height: '200px',
                                width: 'auto'
                              }} />
                            </div>
                            : <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                e.target.value = null

                                const ext = file.name.split('.').pop()
                                const dwallet_name = `qr-digital-wallet.${ext}`

                                const request = new FormData()
                                request.append('image', file)
                                request.append('name', dwallet_name)

                                const result = await galleryRest.save(request)
                                if (!result) return;

                                setFormData({
                                  ...formData,
                                  checkout_dwallet_qr: dwallet_name
                                });
                              }}
                            />
                        }
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Título</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.checkout_dwallet_name}
                          onChange={(e) => setFormData({
                            ...formData,
                            checkout_dwallet_name: e.target.value
                          })}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Descripción</label>
                        <textarea
                          className="form-control"
                          value={formData.checkout_dwallet_description}
                          onChange={(e) => setFormData({
                            ...formData,
                            checkout_dwallet_description: e.target.value
                          })}
                        />
                      </div>
                      <div className="mt-4 mb-2">
                        <h6 className="text-muted">Comisión del Método de Pago</h6>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Comisión (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="Ej: 3.5"
                          value={formData.checkout_dwallet_commission}
                          onChange={(e) => setFormData({ ...formData, checkout_dwallet_commission: e.target.value })}
                        />
                        <small className="text-muted">Dejar en 0 si no desea aplicar comisión</small>
                      </div>
                    </div>
                  </ConditionalField>
                  {/* <div className="tab-pane fade" id="v-transfer" role="tabpanel" aria-labelledby="v-transfer-tab">
                    <div className="mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="checkout-transfer"
                          checked={formData.checkout_transfer == 'true'}
                          onChange={(e) => setFormData({ ...formData, checkout_transfer: String(e.target.checked) })}
                        />
                        <label className="form-check-label form-label" htmlFor="checkout-transfer">
                          Habilitar pago por transferencia
                          <small className="text-muted d-block">Al habilitar esta opción, permite pagos por transferencia</small>
                        </label>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Código de Cuenta Interbancario (CCI)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.checkout_transfer_cci}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_transfer_cci: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.checkout_transfer_name}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_transfer_name: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        value={formData.checkout_transfer_description}
                        onChange={(e) => setFormData({
                          ...formData,
                          checkout_transfer_description: e.target.value
                        })}
                      />
                    </div>
                  </div> */}
                  <ConditionalField correlative="checkout_transfer">
                    <div className="tab-pane fade" id="v-transfer" role="tabpanel" aria-labelledby="v-transfer-tab">
                      <div className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkout-transfer"
                            checked={formData.checkout_transfer === 'true'}
                            onChange={(e) => setFormData({ ...formData, checkout_transfer: String(e.target.checked) })}
                          />
                          <label className="form-check-label form-label" htmlFor="checkout-transfer">
                            Habilitar pago por transferencia
                            <small className="text-muted d-block">Al habilitar esta opción, permite pagos por transferencia</small>
                          </label>
                        </div>
                      </div>

                      {formData.transfer_accounts.map((account, index) => (
                        <div key={index} className="mb-4 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5>Cuenta Bancaria #{index + 1}</h5>
                            {index > 0 && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  const accounts = [...formData.transfer_accounts];
                                  accounts.splice(index, 1);
                                  setFormData({ ...formData, transfer_accounts: accounts });
                                }}
                              >
                                Eliminar Cuenta
                              </button>
                            )}
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Imagen de la Cuenta</label>
                            {account.image ? (
                              <div className="position-relative">
                                <Tippy content="Eliminar Imagen">
                                  <button
                                    className="position-absolute btn btn-xs btn-danger"
                                    style={{ top: '5px', left: '5px' }}
                                    onClick={() => {
                                      const accounts = [...formData.transfer_accounts];
                                      accounts[index].image = null;
                                      setFormData({ ...formData, transfer_accounts: accounts });
                                    }}
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button>
                                </Tippy>
                                <img
                                  src={`/assets/resources/${account.image}`}
                                  className="img-thumbnail"
                                  style={{ height: '200px', width: 'auto' }}
                                />
                              </div>
                            ) : (
                              <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  e.target.value = null;

                                  const ext = file.name.split('.').pop();
                                  const imageName = `transfer-account-${index + 1}.${ext}`;

                                  const request = new FormData();
                                  request.append('image', file);
                                  request.append('name', imageName);

                                  const result = await galleryRest.save(request);
                                  if (!result) return;

                                  const accounts = [...formData.transfer_accounts];
                                  accounts[index].image = imageName;
                                  setFormData({ ...formData, transfer_accounts: accounts });
                                }}
                              />
                            )}
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Número de Cuenta (CC)</label>
                            <input
                              type="text"
                              className="form-control"
                              value={account.cc}
                              onChange={(e) => {
                                const accounts = [...formData.transfer_accounts];
                                accounts[index].cc = e.target.value;
                                setFormData({ ...formData, transfer_accounts: accounts });
                              }}
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Código de Cuenta Interbancario (CCI)</label>
                            <input
                              type="text"
                              className="form-control"
                              value={account.cci}
                              onChange={(e) => {
                                const accounts = [...formData.transfer_accounts];
                                accounts[index].cci = e.target.value;
                                setFormData({ ...formData, transfer_accounts: accounts });
                              }}
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Nombre del Banco/Titular</label>
                            <input
                              type="text"
                              className="form-control"
                              value={account.name}
                              onChange={(e) => {
                                const accounts = [...formData.transfer_accounts];
                                accounts[index].name = e.target.value;
                                setFormData({ ...formData, transfer_accounts: accounts });
                              }}
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label">Descripción</label>
                            <textarea
                              className="form-control"
                              value={account.description}
                              onChange={(e) => {
                                const accounts = [...formData.transfer_accounts];
                                accounts[index].description = e.target.value;
                                setFormData({ ...formData, transfer_accounts: accounts });
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            transfer_accounts: [
                              ...formData.transfer_accounts,
                              {
                                image: null,
                                cc: "",
                                cci: "",
                                name: "",
                                description: ""
                              }
                            ]
                          });
                        }}
                      >
                        Agregar Otra Cuenta
                      </button>
                      
                      <div className="mt-4 mb-2">
                        <h6 className="text-muted">Comisión del Método de Pago</h6>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Comisión (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="Ej: 3.5"
                          value={formData.checkout_transfer_commission}
                          onChange={(e) => setFormData({ ...formData, checkout_transfer_commission: e.target.value })}
                        />
                        <small className="text-muted">Dejar en 0 si no desea aplicar comisión</small>
                      </div>
                    </div>
                  </ConditionalField>
                </div>
              </div>
            </div>

            {/* Tab de Policies */}
            <div
              className={`tab-pane fade ${activeTab === "policies" ? "show active" : ""}`}
              role="tabpanel"
            >

              <div className="mb-2" hidden={!some(generals, (general) => general.correlative === "privacy_policy")}>
                <QuillFormGroup
                  label="Política de privacidad"
                  value={formData.privacyPolicy}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      privacyPolicy: value,
                    })
                  }
                />
              </div>

            

                <div className="mb-2" hidden={!some(generals, (general) => general.correlative === "terms_conditions")}>
                  <QuillFormGroup
                    label="Términos y condiciones"
                    value={formData.termsConditions}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        termsConditions: value,
                      })
                    }
                  />
                </div>

              <div className="mb-2" hidden={!some(generals, (general) => general.correlative === "delivery_policy")} >
                <QuillFormGroup
                  label="Políticas de envío"
                  value={formData.deliveryPolicy}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      deliveryPolicy: value,
                    })
                  }
                />
              </div>
              <div className="mb-2" hidden={!some(generals, (general) => general.correlative === "saleback_policy")}>
                <QuillFormGroup
                  label="Políticas de devolución y cambio"
                  value={formData.salebackPolicy}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      salebackPolicy: value,
                    })
                  }
                />
              </div>

              {/* Campos de PDF usando repositoryRest */}
              <div className="mb-2" hidden={!some(generals, (general) => general.correlative === "politica_sistema_gestion")}>
                <label className="form-label">Política del sistema de Gestión (PDF)</label>
                {formData.politicaSistemaGestion ? (
                  <div className="position-relative">
                    <Tippy content="Eliminar PDF">
                      <button
                        type="button"
                        className="position-absolute btn btn-xs btn-danger"
                        style={{ top: '5px', left: '5px', zIndex: 10 }}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            politicaSistemaGestion: ""
                          });
                        }}
                      >
                        <i className="mdi mdi-delete"></i>
                      </button>
                    </Tippy>
                    <div className="d-flex align-items-center p-3 border rounded bg-light">
                      <i className="mdi mdi-file-pdf-box text-danger me-2" style={{ fontSize: '2rem' }}></i>
                      <div className="flex-grow-1">
                        <strong>Archivo PDF cargado</strong>
                        <br />
                        <small className="text-muted">{formData.politicaSistemaGestion}</small>
                      </div>
                      <a
                        href={`/cloud/${formData.politicaSistemaGestion}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="mdi mdi-eye"></i> Ver
                      </a>
                    </div>
                  </div>
                ) : (
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      
                      // Validar que sea PDF
                      if (file.type !== 'application/pdf') {
                        alert('Por favor, selecciona solo archivos PDF');
                        e.target.value = null;
                        return;
                      }
                      
                      e.target.value = null;

                      const request = new FormData();
                      request.append('file', file);
                      request.append('name', `politica-sistema-gestion.pdf`);

                      const result = await repositoryRest.save(request);
                      if (!result) return;

                      // Guardar el UUID del archivo devuelto por la API
                      setFormData({
                        ...formData,
                        politicaSistemaGestion: result.file
                      });
                    }}
                  />
                )}
                <small className="text-muted">Solo se permiten archivos PDF</small>
              </div>

              <div className="mb-2" hidden={!some(generals, (general) => general.correlative === "alcance_sistema_gestion")}>
                <label className="form-label">Alcance del sistema de Gestión (PDF)</label>
                {formData.alcanceSistemaGestion ? (
                  <div className="position-relative">
                    <Tippy content="Eliminar PDF">
                      <button
                        type="button"
                        className="position-absolute btn btn-xs btn-danger"
                        style={{ top: '5px', left: '5px', zIndex: 10 }}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            alcanceSistemaGestion: ""
                          });
                        }}
                      >
                        <i className="mdi mdi-delete"></i>
                      </button>
                    </Tippy>
                    <div className="d-flex align-items-center p-3 border rounded bg-light">
                      <i className="mdi mdi-file-pdf-box text-danger me-2" style={{ fontSize: '2rem' }}></i>
                      <div className="flex-grow-1">
                        <strong>Archivo PDF cargado</strong>
                        <br />
                        <small className="text-muted">{formData.alcanceSistemaGestion}</small>
                      </div>
                      <a
                        href={`/cloud/${formData.alcanceSistemaGestion}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="mdi mdi-eye"></i> Ver
                      </a>
                    </div>
                  </div>
                ) : (
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      
                      // Validar que sea PDF
                      if (file.type !== 'application/pdf') {
                        alert('Por favor, selecciona solo archivos PDF');
                        e.target.value = null;
                        return;
                      }
                      
                      e.target.value = null;

                      const request = new FormData();
                      request.append('file', file);
                      request.append('name', `alcance-sistema-gestion.pdf`);

                      const result = await repositoryRest.save(request);
                      if (!result) return;

                      // Guardar el UUID del archivo devuelto por la API
                      setFormData({
                        ...formData,
                        alcanceSistemaGestion: result.file
                      });
                    }}
                  />
                )}
                <small className="text-muted">Solo se permiten archivos PDF</small>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "cintillos" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">
                      <i className="fas fa-bullhorn text-primary me-2"></i>
                      Gestión de Cintillos Programados
                    </h4>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => openCintilloModal()}
                    >
                      <i className="fas fa-plus me-2"></i>Nuevo Cintillo
                    </button>
                  </div>

                  {formData.cintillos.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-bullhorn text-muted" style={{ fontSize: '4rem' }}></i>
                      <h5 className="text-muted mt-3">No hay cintillos configurados</h5>
                      <p className="text-muted">Agrega tu primer cintillo para comenzar</p>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="table-light">
                              <tr>
                                <th width="5%">#</th>
                                <th width="35%">Texto del Cintillo</th>
                                <th width="20%">Días Programados</th>
                                <th width="15%">Estado</th>
                                <th width="15%">Activo</th>
                                <th width="10%">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.cintillos.map((cintillo, index) => {
                                const text = typeof cintillo === 'string' ? cintillo : cintillo.text || '';
                                const enabled = typeof cintillo === 'string' ? true : cintillo.enabled !== false;
                                const status = getActiveStatus(cintillo);
                                const scheduleSummary = getScheduleSummary(cintillo);
                                
                                return (
                                  <tr key={`cintillo-${index}`}>
                                    <td className="fw-bold text-muted">{index + 1}</td>
                                    <td>
                                      <div className="text-truncate" style={{ maxWidth: '300px' }} title={text}>
                                        {text || <span className="text-muted fst-italic">Sin texto</span>}
                                      </div>
                                    </td>
                                    <td>
                                      <small className="text-muted">{scheduleSummary}</small>
                                    </td>
                                    <td>
                                      <span className={status.class}>{status.status}</span>
                                    </td>
                                    <td>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`cintillo-enabled-table-${index}`}
                                          checked={enabled}
                                          onChange={(e) => {
                                            const newCintillos = [...formData.cintillos];
                                            if (typeof newCintillos[index] === 'string') {
                                              newCintillos[index] = {
                                                text: newCintillos[index],
                                                enabled: e.target.checked,
                                                schedule: {
                                                  monday: { enabled: true, start: '00:00', end: '23:59' },
                                                  tuesday: { enabled: true, start: '00:00', end: '23:59' },
                                                  wednesday: { enabled: true, start: '00:00', end: '23:59' },
                                                  thursday: { enabled: true, start: '00:00', end: '23:59' },
                                                  friday: { enabled: true, start: '00:00', end: '23:59' },
                                                  saturday: { enabled: true, start: '00:00', end: '23:59' },
                                                  sunday: { enabled: true, start: '00:00', end: '23:59' }
                                                }
                                              };
                                            } else {
                                              newCintillos[index].enabled = e.target.checked;
                                            }
                                            setFormData({
                                              ...formData,
                                              cintillos: newCintillos
                                            });
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div className="btn-group btn-group-sm">
                                        <button
                                          type="button"
                                          className="btn btn-outline-primary"
                                          onClick={() => openCintilloModal(index)}
                                          title="Editar"
                                        >
                                          <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-outline-danger"
                                          onClick={() => {
                                            if (confirm('¿Estás seguro de que quieres eliminar este cintillo?')) {
                                              handleRemoveField(index, "cintillos");
                                            }
                                          }}
                                          title="Eliminar"
                                        >
                                          <i className="fas fa-trash"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "location" ? "show active" : ""}`}
              role="tabpanel"
            >
              <LoadScript 
                googleMapsApiKey={Global.GMAPS_API_KEY}
                libraries={libraries}
              >
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-search me-2"></i>
                    Buscar ubicación
                  </label>
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Busca tu dirección o nombre del lugar..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </Autocomplete>
                  <small className="form-text text-muted">
                    Escribe el nombre o dirección de tu tienda para centrar el mapa automáticamente.
                  </small>
                </div>

                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "400px",
                  }}
                  center={formData.location}
                  zoom={15}
                  onClick={handleMapClick}
                >
                  <Marker position={formData.location} />
                </GoogleMap>
              </LoadScript>
              <small className="form-text text-muted mt-2 d-block">
                <i className="fas fa-info-circle me-1"></i>
                Haz clic en el mapa para ajustar la ubicación exacta después de buscar.
              </small>
              <div className="mt-3 p-3 bg-light rounded">
                <strong>Coordenadas seleccionadas:</strong>
                <div className="mt-2">
                  <span className="badge bg-primary me-2">Latitud: {formData.location.lat.toFixed(6)}</span>
                  <span className="badge bg-success">Longitud: {formData.location.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "shippingfree" ? "show active" : ""}`}
              role="tabpanel"
            >
              <ConditionalField correlative="igv_checkout">
                <div className="mb-2">
                  <label
                    htmlFor="igvCheckout"
                    className="form-label"
                  >
                    IGV
                    <small className="d-block text-muted">Dejar en 0 si no se quiere mostrar</small>
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    className="form-control"
                    id="igvCheckout"
                    value={formData.igvCheckout}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        igvCheckout: e.target.value,
                      })
                    }
                  />
                </div>
              </ConditionalField>
              <ConditionalField correlative="currency">
                <div className="mb-2">
                  <label
                    htmlFor="currency"
                    className="form-label"
                  >
                    Moneda
                    <small className="d-block text-muted" style={{ fontWeight: 'lighter' }}>¿Qué moneda maneja tu empresa?</small>
                  </label>
                  <select
                    className="form-control"
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currency: e.target.value,
                      })
                    }
                  >
                    <option value="pen">Soles (S/)</option>
                    <option value="usd">Dólares ($)</option>
                  </select>
                </div>
              </ConditionalField>
              
              {/* Campo de tipo de cambio - Solo visible cuando la moneda es USD */}
              {formData.currency === 'usd' && (
                <div className="mb-2">
                  <label
                    htmlFor="exchange_rate_usd_pen"
                    className="form-label"
                  >
                    <i className="mdi mdi-currency-usd me-1"></i>
                    Tipo de Cambio (USD → PEN)
                    <small className="d-block text-muted" style={{ fontWeight: 'lighter' }}>
                      <strong>⚠️ Importante:</strong> Culqi solo procesa pagos en Soles (PEN). 
                      Este tipo de cambio se usará para convertir el monto de dólares a soles al procesar pagos con tarjeta.
                    </small>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">1 USD =</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="form-control"
                      id="exchange_rate_usd_pen"
                      value={formData.exchange_rate_usd_pen}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exchange_rate_usd_pen: e.target.value,
                        })
                      }
                      placeholder="3.75"
                    />
                    <span className="input-group-text">PEN</span>
                  </div>
                  <small className="text-info">
                    <i className="mdi mdi-information-outline me-1"></i>
                    Ejemplo: Si un producto cuesta $100 USD y el tipo de cambio es 3.75, 
                    Culqi cobrará S/ 375.00 PEN.
                  </small>
                </div>
              )}
              
              <ConditionalField correlative="shipping_free">
                <div className="mb-2">
                  <label className="form-label">Envio gratis a partir de:</label>
                  <input
                    type="text"
                    placeholder="Ingrese el monto para envio gratis"
                    className="form-control"
                    value={formData.shippingFree}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingFree: e.target.value
                    })}
                  />
                </div>
              </ConditionalField>
              
              <ConditionalField correlative="additional_shipping_costs">
                <div className="mb-4 mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-1">
                        <i className="mdi mdi-cash-multiple me-2 text-warning"></i>
                        Costos Adicionales de Envío
                      </h5>
                      <small className="text-muted">
                        Configure costos adicionales según el método de envío y el monto de compra (Ej: embalaje, traslado a agencia, etc.)
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          additional_shipping_costs: [
                            ...formData.additional_shipping_costs,
                            {
                              enabled: true,
                              delivery_method: 'agency',
                              min_amount: 0,
                              max_amount: 390,
                              additional_cost: 15,
                              description: 'Costo de embalaje y traslado a agencia'
                            }
                          ]
                        });
                      }}
                    >
                      <i className="mdi mdi-plus me-1"></i>
                      Agregar Regla
                    </button>
                  </div>

                  {formData.additional_shipping_costs.length === 0 ? (
                    <div className="alert alert-info">
                      <i className="mdi mdi-information me-2"></i>
                      No hay reglas de costos adicionales configuradas. Haga clic en "Agregar Regla" para crear una.
                    </div>
                  ) : (
                    <div className="row">
                      {formData.additional_shipping_costs.map((cost, index) => (
                        <div key={index} className="col-12 mb-3">
                          <div className="card border">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">
                                <i className="mdi mdi-numeric-{index + 1}-circle me-2"></i>
                                Regla #{index + 1}
                              </h6>
                              <div className="d-flex align-items-center gap-2">
                                <div className="form-check form-switch mb-0">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`additional-cost-enabled-${index}`}
                                    checked={cost.enabled}
                                    onChange={(e) => {
                                      const newCosts = [...formData.additional_shipping_costs];
                                      newCosts[index].enabled = e.target.checked;
                                      setFormData({
                                        ...formData,
                                        additional_shipping_costs: newCosts
                                      });
                                    }}
                                  />
                                  <label className="form-check-label" htmlFor={`additional-cost-enabled-${index}`}>
                                    {cost.enabled ? 'Activo' : 'Inactivo'}
                                  </label>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    if (confirm('¿Está seguro de eliminar esta regla?')) {
                                      const newCosts = [...formData.additional_shipping_costs];
                                      newCosts.splice(index, 1);
                                      setFormData({
                                        ...formData,
                                        additional_shipping_costs: newCosts
                                      });
                                    }
                                  }}
                                >
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label className="form-label">Método de Envío</label>
                                  <select
                                    className="form-select"
                                    value={cost.delivery_method}
                                    onChange={(e) => {
                                      const newCosts = [...formData.additional_shipping_costs];
                                      newCosts[index].delivery_method = e.target.value;
                                      setFormData({
                                        ...formData,
                                        additional_shipping_costs: newCosts
                                      });
                                    }}
                                  >
                                    <option value="all">Todos los métodos</option>
                                    <option value="agency">Agencia</option>
                                    <option value="express">Express</option>
                                    <option value="standard">Estándar</option>
                                    <option value="store_pickup">Recojo en tienda</option>
                                  </select>
                                  <small className="text-muted">Seleccione a qué método de envío aplica</small>
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                  <label className="form-label">Descripción</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: Costo de embalaje y traslado"
                                    value={cost.description || ''}
                                    onChange={(e) => {
                                      const newCosts = [...formData.additional_shipping_costs];
                                      newCosts[index].description = e.target.value;
                                      setFormData({
                                        ...formData,
                                        additional_shipping_costs: newCosts
                                      });
                                    }}
                                  />
                                  <small className="text-muted">Concepto del costo adicional</small>
                                </div>

                                <div className="col-md-4 mb-3">
                                  <label className="form-label">Monto Mínimo de Compra</label>
                                  <div className="input-group">
                                    <span className="input-group-text">S/</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="form-control"
                                      placeholder="0.00"
                                      value={cost.min_amount || 0}
                                      onChange={(e) => {
                                        const newCosts = [...formData.additional_shipping_costs];
                                        newCosts[index].min_amount = parseFloat(e.target.value) || 0;
                                        setFormData({
                                          ...formData,
                                          additional_shipping_costs: newCosts
                                        });
                                      }}
                                    />
                                  </div>
                                  <small className="text-muted">Desde qué monto aplica</small>
                                </div>

                                <div className="col-md-4 mb-3">
                                  <label className="form-label">Monto Máximo de Compra</label>
                                  <div className="input-group">
                                    <span className="input-group-text">S/</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="form-control"
                                      placeholder="390.00"
                                      value={cost.max_amount || 0}
                                      onChange={(e) => {
                                        const newCosts = [...formData.additional_shipping_costs];
                                        newCosts[index].max_amount = parseFloat(e.target.value) || 0;
                                        setFormData({
                                          ...formData,
                                          additional_shipping_costs: newCosts
                                        });
                                      }}
                                    />
                                  </div>
                                  <small className="text-muted">Hasta qué monto aplica (0 = sin límite)</small>
                                </div>

                                <div className="col-md-4 mb-3">
                                  <label className="form-label">Costo Adicional</label>
                                  <div className="input-group">
                                    <span className="input-group-text">S/</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="form-control"
                                      placeholder="15.00"
                                      value={cost.additional_cost || 0}
                                      onChange={(e) => {
                                        const newCosts = [...formData.additional_shipping_costs];
                                        newCosts[index].additional_cost = parseFloat(e.target.value) || 0;
                                        setFormData({
                                          ...formData,
                                          additional_shipping_costs: newCosts
                                        });
                                      }}
                                    />
                                  </div>
                                  <small className="text-muted">Monto a cobrar adicionalmente</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ConditionalField>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "importation" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row mb-2">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                  <div className="mb-3">
                    <label
                      htmlFor="importation_flete"
                      className="form-label"
                    >
                      Precio por peso (flete)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="mdi mdi-circle-multiple"></i>
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="importation_flete"
                        value={formData.importation_flete}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            importation_flete: e.target.value,
                          })
                        }

                      />
                      <span className="input-group-text">por kg</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="importation_seguro"
                      className="form-label"
                    >
                      Seguro de importación
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="importation_seguro"
                        value={formData.importation_seguro}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            importation_seguro: e.target.value,
                          })
                        }

                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="importation_derecho_arancelario"
                      className="form-label"
                    >
                      Derechos arancelarios
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="importation_derecho_arancelario"
                        value={formData.importation_derecho_arancelario}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            importation_derecho_arancelario: e.target.value,
                          })
                        }

                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="importation_derecho_arancelario_descripcion"
                      className="form-label"
                    >
                      Descripción de derechos arancelarios
                      <small className="text-muted d-block">Qué porcentajes se están considerando en cálculo de derechos arancelarios</small>
                    </label>
                    <textarea
                      className="form-control"
                      id="importation_derecho_arancelario_descripcion"
                      value={formData.importation_derecho_arancelario_descripcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          importation_derecho_arancelario_descripcion: e.target.value,
                        })
                      }
                      rows={3}
                      style={{ minHeight: (3 * 27), fieldSizing: 'content' }}

                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "corporate" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="mb-2">
                <label className="form-label">Email Corporativo Principal</label>
                <input
                  type="email"
                  placeholder="contacto@empresa.com"
                  className="form-control"
                  value={formData.coorporativeEmail}
                  onChange={(e) => setFormData({
                    ...formData,
                    coorporativeEmail: e.target.value
                  })}
                />
                <small className="text-muted">Este email se usará para comunicaciones corporativas y notificaciones del sistema</small>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "seo" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row">
                <div className="col-12">
                  <h5 className="mb-4">
                    <i className="fas fa-search me-2 text-primary"></i>
                    Configuración SEO y Meta Tags
                  </h5>
                  <p className="text-muted mb-4">
                    Configure los meta tags para optimizar su sitio web para motores de búsqueda y redes sociales.
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h6 className="mb-3">
                    <i className="fas fa-globe me-2"></i>Meta Tags Básicos
                  </h6>
                  
                  <ConditionalSeoField correlative="site_title">
                    <div className="mb-3">
                      <label className="form-label">Título del Sitio</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Mi Sitio Web - Descripción breve"
                        value={formData.siteTitle}
                        onChange={(e) => setFormData({
                          ...formData,
                          siteTitle: e.target.value
                        })}
                      />
                      <small className="text-muted">Título principal que aparece en la pestaña del navegador</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="site_description">
                    <div className="mb-3">
                      <label className="form-label">Descripción del Sitio</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Descripción breve del sitio web para SEO..."
                        value={formData.siteDescription}
                        onChange={(e) => setFormData({
                          ...formData,
                          siteDescription: e.target.value
                        })}
                      />
                      <small className="text-muted">Descripción que aparece en los resultados de búsqueda (máx. 160 caracteres)</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="site_keywords">
                    <div className="mb-3">
                      <label className="form-label">Palabras Clave</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="palabra1, palabra2, palabra3"
                        value={formData.siteKeywords}
                        onChange={(e) => setFormData({
                          ...formData,
                          siteKeywords: e.target.value
                        })}
                      />
                      <small className="text-muted">Palabras clave separadas por comas</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="canonical_url">
                    <div className="mb-3">
                      <label className="form-label">URL Canónica</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://midominio.com"
                        value={formData.canonicalUrl}
                        onChange={(e) => setFormData({
                          ...formData,
                          canonicalUrl: e.target.value
                        })}
                      />
                      <small className="text-muted">URL principal del sitio para evitar contenido duplicado</small>
                    </div>
                  </ConditionalSeoField>

                
                </div>

                <div className="col-md-6">
                  <h6 className="mb-3">
                    <i className="fab fa-facebook me-2"></i>Open Graph (Facebook/LinkedIn)
                  </h6>

                  <ConditionalSeoField correlative="og_title">
                    <div className="mb-3">
                      <label className="form-label">Título Open Graph</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Título para compartir en redes sociales"
                        value={formData.ogTitle}
                        onChange={(e) => setFormData({
                          ...formData,
                          ogTitle: e.target.value
                        })}
                      />
                      <small className="text-muted">Título que aparece al compartir en Facebook/LinkedIn</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="og_description">
                    <div className="mb-3">
                      <label className="form-label">Descripción Open Graph</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Descripción atractiva para redes sociales..."
                        value={formData.ogDescription}
                        onChange={(e) => setFormData({
                          ...formData,
                          ogDescription: e.target.value
                        })}
                      />
                      <small className="text-muted">Descripción al compartir en redes sociales</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="og_image">
                    <div className="mb-3">
                      <label className="form-label">Imagen Open Graph</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://midominio.com/imagen-compartir.jpg"
                        value={formData.ogImage}
                        onChange={(e) => setFormData({
                          ...formData,
                          ogImage: e.target.value
                        })}
                      />
                      <small className="text-muted">URL de la imagen para compartir (recomendado: 1200x630px)</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="og_url">
                    <div className="mb-3">
                      <label className="form-label">URL Open Graph</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://midominio.com"
                        value={formData.ogUrl}
                        onChange={(e) => setFormData({
                          ...formData,
                          ogUrl: e.target.value
                        })}
                      />
                      <small className="text-muted">URL que se mostrará al compartir</small>
                    </div>
                  </ConditionalSeoField>

                  <h6 className="mb-3 mt-4">
                    <i className="fab fa-twitter me-2"></i>Twitter Cards
                  </h6>

                  <ConditionalSeoField correlative="twitter_card">
                    <div className="mb-3">
                      <label className="form-label">Tipo de Twitter Card</label>
                      <select
                        className="form-control"
                        value={formData.twitterCard}
                        onChange={(e) => setFormData({
                          ...formData,
                          twitterCard: e.target.value
                        })}
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                      </select>
                      <small className="text-muted">Tipo de tarjeta para Twitter</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="twitter_title">
                    <div className="mb-3">
                      <label className="form-label">Título Twitter</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Título para Twitter"
                        value={formData.twitterTitle}
                        onChange={(e) => setFormData({
                          ...formData,
                          twitterTitle: e.target.value
                        })}
                      />
                      <small className="text-muted">Título específico para Twitter</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="twitter_description">
                    <div className="mb-3">
                      <label className="form-label">Descripción Twitter</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Descripción para Twitter..."
                        value={formData.twitterDescription}
                        onChange={(e) => setFormData({
                          ...formData,
                          twitterDescription: e.target.value
                        })}
                      />
                      <small className="text-muted">Descripción específica para Twitter</small>
                    </div>
                  </ConditionalSeoField>

                  <ConditionalSeoField correlative="twitter_image">
                    <div className="mb-3">
                      <label className="form-label">Imagen Twitter</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://midominio.com/imagen-twitter.jpg"
                        value={formData.twitterImage}
                        onChange={(e) => setFormData({
                          ...formData,
                          twitterImage: e.target.value
                        })}
                      />
                      <small className="text-muted">URL de la imagen para Twitter Cards</small>
                    </div>
                  </ConditionalSeoField>
                </div>
              </div>

              <div className="alert alert-info mt-4">
                <h6>
                  <i className="fas fa-lightbulb me-2"></i>Consejos para SEO
                </h6>
                <ul className="mb-0">
                  <li><strong>Título:</strong> Mantenga entre 50-60 caracteres para mejor visualización</li>
                  <li><strong>Descripción:</strong> Use entre 150-160 caracteres para aparecer completa en búsquedas</li>
                  <li><strong>Imágenes:</strong> Use imágenes de alta calidad (1200x630px para Open Graph)</li>
                  <li><strong>Palabras clave:</strong> Use términos relevantes que sus usuarios buscarían</li>
                </ul>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "pixels" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">Google Analytics & Ads</h5>
                  <div className="mb-3">
                    <label className="form-label">Google Analytics ID</label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX o UA-XXXXXXXX-X"
                      className="form-control"
                      value={formData.googleAnalyticsId}
                      onChange={(e) => setFormData({
                        ...formData,
                        googleAnalyticsId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID de Google Analytics para tracking de visitas</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Google Tag Manager ID</label>
                    <input
                      type="text"
                      placeholder="GTM-XXXXXXX"
                      className="form-control"
                      value={formData.googleTagManagerId}
                      onChange={(e) => setFormData({
                        ...formData,
                        googleTagManagerId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID de Google Tag Manager</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Google Ads Conversion ID</label>
                    <input
                      type="text"
                      placeholder="AW-XXXXXXXXX"
                      className="form-control"
                      value={formData.googleAdsConversionId}
                      onChange={(e) => setFormData({
                        ...formData,
                        googleAdsConversionId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID de conversión de Google Ads</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Google Ads Conversion Label</label>
                    <input
                      type="text"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxx"
                      className="form-control"
                      value={formData.googleAdsConversionLabel}
                      onChange={(e) => setFormData({
                        ...formData,
                        googleAdsConversionLabel: e.target.value
                      })}
                    />
                    <small className="text-muted">Etiqueta de conversión de Google Ads</small>
                  </div>

                  <h5 className="mb-3">Redes Sociales</h5>
                  <div className="mb-3">
                    <label className="form-label">Facebook Pixel ID</label>
                    <input
                      type="text"
                      placeholder="XXXXXXXXXXXXXXX"
                      className="form-control"
                      value={formData.facebookPixelId}
                      onChange={(e) => setFormData({
                        ...formData,
                        facebookPixelId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID del píxel de Facebook</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">TikTok Pixel ID</label>
                    <input
                      type="text"
                      placeholder="XXXXXXXXXXXXXXXXX"
                      className="form-control"
                      value={formData.tiktokPixelId}
                      onChange={(e) => setFormData({
                        ...formData,
                        tiktokPixelId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID del píxel de TikTok</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">LinkedIn Insight Tag ID</label>
                    <input
                      type="text"
                      placeholder="XXXXXXX"
                      className="form-control"
                      value={formData.linkedinInsightTag}
                      onChange={(e) => setFormData({
                        ...formData,
                        linkedinInsightTag: e.target.value
                      })}
                    />
                    <small className="text-muted">ID del Insight Tag de LinkedIn</small>
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="mb-3">Otras Plataformas</h5>
                  <div className="mb-3">
                    <label className="form-label">Hotjar ID</label>
                    <input
                      type="text"
                      placeholder="XXXXXXX"
                      className="form-control"
                      value={formData.hotjarId}
                      onChange={(e) => setFormData({
                        ...formData,
                        hotjarId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID de Hotjar para mapas de calor</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Microsoft Clarity ID</label>
                    <input
                      type="text"
                      placeholder="xxxxxxxxxx"
                      className="form-control"
                      value={formData.clarityId}
                      onChange={(e) => setFormData({
                        ...formData,
                        clarityId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID de Microsoft Clarity</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Twitter Pixel ID</label>
                    <input
                      type="text"
                      placeholder="o1234"
                      className="form-control"
                      value={formData.twitterPixelId}
                      onChange={(e) => setFormData({
                        ...formData,
                        twitterPixelId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID del píxel de Twitter</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Pinterest Tag ID</label>
                    <input
                      type="text"
                      placeholder="26xxxxxxxxxxxxxxxxxx"
                      className="form-control"
                      value={formData.pinterestTagId}
                      onChange={(e) => setFormData({
                        ...formData,
                        pinterestTagId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID del tag de Pinterest</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Snapchat Pixel ID</label>
                    <input
                      type="text"
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className="form-control"
                      value={formData.snapchatPixelId}
                      onChange={(e) => setFormData({
                        ...formData,
                        snapchatPixelId: e.target.value
                      })}
                    />
                    <small className="text-muted">ID del píxel de Snapchat</small>
                  </div>

                  <h5 className="mb-3">Scripts Personalizados</h5>
                  <div className="mb-3">
                    <label className="form-label">Scripts en Head</label>
                    <textarea
                      rows="4"
                      placeholder="Scripts que se insertarán en el &lt;head&gt;"
                      className="form-control"
                      value={formData.customHeadScripts}
                      onChange={(e) => setFormData({
                        ...formData,
                        customHeadScripts: e.target.value
                      })}
                    />
                    <small className="text-muted">Scripts personalizados para el &lt;head&gt;</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Scripts en Body</label>
                    <textarea
                      rows="4"
                      placeholder="Scripts que se insertarán antes del &lt;/body&gt;"
                      className="form-control"
                      value={formData.customBodyScripts}
                      onChange={(e) => setFormData({
                        ...formData,
                        customBodyScripts: e.target.value
                      })}
                    />
                    <small className="text-muted">Scripts personalizados para el final del &lt;body&gt;</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Atalaya Leads API Key</label>
                    <input
                      type="text"
                      placeholder="API Key de Atalaya CRM (ejemplo: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)"
                      className="form-control"
                      value={formData.atalayaLeadsApiKey}
                      onChange={(e) => setFormData({
                        ...formData,
                        atalayaLeadsApiKey: e.target.value
                      })}
                    />
                    <small className="text-muted">
                      API Key para enviar leads del formulario de contacto a Atalaya CRM. 
                      <a href="https://atalaya.pe" target="_blank" rel="noopener noreferrer" className="text-primary">Obtén tu API Key aquí</a>
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* OAuth & Autenticación Tab */}
            <div
              className={`tab-pane fade ${activeTab === "oauth" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row">
                <div className="col-12">
                  <h5 className="mb-4">🔐 Configuración de Google OAuth</h5>

                  {/* Switch para habilitar Google OAuth */}
                  <div className="mb-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="googleOauthEnabled"
                        checked={formData.googleOauthEnabled === "true"}
                        onChange={(e) => setFormData({
                          ...formData,
                          googleOauthEnabled: String(e.target.checked)
                        })}
                      />
                      <label className="form-check-label" htmlFor="googleOauthEnabled">
                        <strong>Habilitar inicio de sesión con Google</strong>
                      </label>
                    </div>
                    <small className="text-muted">
                      Permite a los clientes registrarse e iniciar sesión usando su cuenta de Google
                    </small>
                  </div>

                  {formData.googleOauthEnabled === "true" && (
                    <>
                      <div className="alert alert-info">
                        <h6>📋 Instrucciones de configuración:</h6>
                        <ol className="mb-0">
                          <li>Ve a <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                          <li>Crea un nuevo proyecto o selecciona uno existente</li>
                          <li>Habilita la API de "Google+ API" y "Google Sign-In API"</li>
                          <li>Ve a "Credenciales" → "Crear credenciales" → "ID de cliente OAuth 2.0"</li>
                          <li>Configura como "Aplicación web"</li>
                          <li>Agrega estos dominios autorizados:
                            <ul>
                              <li><strong>JavaScript origins:</strong> <code>{window.location.origin}</code></li>
                              <li><strong>Redirect URIs:</strong> <code>{window.location.origin}/auth/google/callback</code></li>
                            </ul>
                          </li>
                          <li>Copia el Client ID y Client Secret en los campos de abajo</li>
                        </ol>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Google Client ID</label>
                            <input
                              type="text"
                              placeholder="123456789-abcdefghijk.apps.googleusercontent.com"
                              className="form-control"
                              value={formData.googleClientId}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleClientId: e.target.value
                              })}
                            />
                            <small className="text-muted">Client ID obtenido de Google Cloud Console</small>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Google Client Secret</label>
                            <input
                              type="password"
                              placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                              className="form-control"
                              value={formData.googleClientSecret}
                              onChange={(e) => setFormData({
                                ...formData,
                                googleClientSecret: e.target.value
                              })}
                            />
                            <small className="text-muted">Client Secret obtenido de Google Cloud Console</small>
                          </div>
                        </div>
                      </div>

                      {formData.googleClientId && formData.googleClientSecret && (
                        <div className="alert alert-success">
                          <h6>✅ Configuración completa</h6>
                          <p className="mb-0">
                            Una vez guardada la configuración, los botones de "Continuar con Google"
                            aparecerán automáticamente en las páginas de login y registro.
                          </p>
                        </div>
                      )}

                      <div className="alert alert-warning">
                        <h6>⚠️ Importante para producción:</h6>
                        <p className="mb-0">
                          Para usar en producción, asegúrate de actualizar los dominios autorizados
                          en Google Cloud Console con tu dominio real (ej: https://tudominio.com)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Pasarelas de Pago Tab */}
            <div
              className={`tab-pane fade ${activeTab === "payments" ? "show active" : ""}`}
              role="tabpanel"
            >
              <div className="row">
                <div className="col-12">
                  <h5 className="mb-4">💳 Configuración de Pasarelas de Pago</h5>

                  {/* Culqi Configuration */}
                  <div className="card mb-4">
                    <div className="card-header">
                      <h6 className="card-title mb-0">🔒 Culqi - Pagos con Tarjeta</h6>
                    </div>
                    <div className="card-body">
                      {/* Switch para habilitar Culqi */}
                      <div className="mb-4">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="culqiEnabled"
                            checked={formData.checkout_culqi === "true"}
                            onChange={(e) => setFormData({
                              ...formData,
                              checkout_culqi: String(e.target.checked)
                            })}
                          />
                          <label className="form-check-label" htmlFor="culqiEnabled">
                            <strong>Habilitar pagos con Culqi</strong>
                          </label>
                        </div>
                        <small className="text-muted">
                          Permite a los clientes pagar con tarjetas de crédito/débito, Yape, y otros métodos
                        </small>
                      </div>

                      {formData.checkout_culqi === "true" && (
                        <>
                          <div className="alert alert-info">
                            <h6>📋 Instrucciones de configuración:</h6>
                            <ol className="mb-0">
                              <li>Ve a <a href="https://culqi.com" target="_blank" rel="noopener noreferrer">Culqi.com</a> y crea una cuenta</li>
                              <li>Ve al panel de Culqi → Desarrollo → Llaves API</li>
                              <li>Copia la <strong>Llave Pública</strong> y <strong>Llave Privada</strong></li>
                              <li>Para producción, cambia a las llaves de producción</li>
                              <li>Configura los webhooks si es necesario</li>
                            </ol>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Nombre de la cuenta</label>
                                <input
                                  type="text"
                                  placeholder="Mi Tienda"
                                  className="form-control"
                                  value={formData.checkout_culqi_name}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    checkout_culqi_name: e.target.value
                                  })}
                                />
                                <small className="text-muted">Nombre que aparecerá en el formulario de pago</small>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Llave Pública</label>
                                <input
                                  type="text"
                                  placeholder="pk_test_xxxxxxxxxxxxxxxxx"
                                  className="form-control"
                                  value={formData.checkout_culqi_public_key}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    checkout_culqi_public_key: e.target.value
                                  })}
                                />
                                <small className="text-muted">Llave pública de Culqi (pk_test_ o pk_live_)</small>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Llave Privada</label>
                                <input
                                  type="password"
                                  placeholder="sk_test_xxxxxxxxxxxxxxxxx"
                                  className="form-control"
                                  value={formData.checkout_culqi_private_key}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    checkout_culqi_private_key: e.target.value
                                  })}
                                />
                                <small className="text-muted">Llave privada de Culqi (sk_test_ o sk_live_)</small>
                              </div>
                            </div>
                          </div>

                          {formData.checkout_culqi_public_key && formData.checkout_culqi_private_key && (
                            <div className="alert alert-success">
                              <h6>✅ Configuración completa</h6>
                              <p className="mb-0">
                                Una vez guardada la configuración, los pagos con Culqi estarán disponibles en el checkout.
                                Los clientes podrán pagar con tarjetas, Yape, banca móvil y otros métodos.
                              </p>
                            </div>
                          )}

                          <div className="alert alert-warning">
                            <h6>⚠️ Importante para producción:</h6>
                            <p className="mb-0">
                              Para usar en producción, asegúrate de cambiar a las llaves de producción (pk_live_ y sk_live_)
                              y configurar correctamente los webhooks en el panel de Culqi.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="alert alert-info">
                    <h6>ℹ️ Información adicional</h6>
                    <p className="mb-2">Las configuraciones de pasarelas de pago se almacenan de forma segura en la base de datos.</p>
                    <ul className="mb-0">
                      <li>Las llaves privadas nunca se exponen al frontend</li>
                      <li>Las configuraciones se pueden cambiar sin editar archivos del servidor</li>
                      <li>Los cambios toman efecto inmediatamente después de guardar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>




          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
          <Toaster />
        </form>

      </div>
      {/* Modal para gestión de visibilidad de campos */}
      {
        showVisibilityModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Gestionar Visibilidad de Campos</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowVisibilityModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted mb-3">
                    Selecciona qué campos serán visibles para los usuarios Admin. Los campos marcados
                    estarán disponibles para Admin, los desmarcados solo serán visibles para Root.
                  </p>

                  {/* Organizar campos por categorías */}
                  {Object.entries(tabCorrelatives).map(([tabKey, correlatives]) => {
                    const tabNames = {
                      'general': 'General',
                      'email': 'Templates de Email',
                      'contact': 'Contacto & WhatsApp',
                      'checkout': 'Métodos de Pago',
                      'importation': 'Costos de Importación',
                      'policies': 'Políticas & Términos',
                      'location': 'Ubicación & Mapa',
                      'shippingfree': 'Envío & Facturación',
                      'seo': 'SEO & Meta Tags',
                      'corporate': 'Datos Corporativos',
                      'pixels': 'Analítica & Pixels',
                      'oauth': 'OAuth & Autenticación'
                    };

                    const tabName = tabNames[tabKey] || tabKey;

                    const tabFields = (allGenerals || generals).filter(general =>
                      correlatives.includes(general.correlative)
                    );

                    if (tabFields.length === 0) return null;

                    return (
                      <div key={tabKey} className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <h4 className="text-primary mb-0 me-2 ">{tabName}</h4>
                         
                        </div>
                        <div className="row">
                          {tabFields.map((general) => (
                            <div key={general.correlative} className="col-md-6 mb-2">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`field-${general.correlative}`}
                                  checked={fieldVisibility[general.correlative] || false}
                                  onChange={() => handleToggleFieldVisibility(general.correlative)}
                                />
                                <label className="form-check-label" htmlFor={`field-${general.correlative}`}>
                                  <strong>{general.name}</strong>
                                 
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <hr className="my-3" />
                      </div>
                    );
                  })}

                  {/* Sección SEO - Campos especiales que siempre deben aparecer */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <h4 className="text-primary mb-0 me-2">SEO & Meta Tags</h4>
                    </div>
                    <div className="row">
                      {[
                        { correlative: 'site_title', name: 'Título del Sitio' },
                        { correlative: 'site_description', name: 'Descripción del Sitio' },
                        { correlative: 'site_keywords', name: 'Palabras Clave' },
                        { correlative: 'og_title', name: 'Título Open Graph' },
                        { correlative: 'og_description', name: 'Descripción Open Graph' },
                        { correlative: 'og_image', name: 'Imagen Open Graph' },
                        { correlative: 'og_url', name: 'URL Open Graph' },
                        { correlative: 'twitter_title', name: 'Título Twitter' },
                        { correlative: 'twitter_description', name: 'Descripción Twitter' },
                        { correlative: 'twitter_image', name: 'Imagen Twitter' },
                        { correlative: 'twitter_card', name: 'Tipo Twitter Card' },
                        { correlative: 'favicon', name: 'Favicon' },
                        { correlative: 'canonical_url', name: 'URL Canónica' }
                      ].map((field) => (
                        <div key={field.correlative} className="col-md-6 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`field-${field.correlative}`}
                              checked={fieldVisibility[field.correlative] || false}
                              onChange={() => handleToggleFieldVisibility(field.correlative)}
                            />
                            <label className="form-check-label" htmlFor={`field-${field.correlative}`}>
                              <strong>{field.name}</strong>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <hr className="my-3" />
                  </div>

                  {/* Campos que no pertenecen a ninguna categoría */}
                  {(() => {
                    const allCategorizedCorrelatives = Object.values(tabCorrelatives).flat();
                    const uncategorizedFields = (allGenerals || generals).filter(general =>
                      !allCategorizedCorrelatives.includes(general.correlative)
                    );

                    if (uncategorizedFields.length === 0) return null;

                    return (
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <h4 className="text-secondary mb-0 me-2">Otros Campos</h4>
                     
                        </div>
                        <div className="row">
                          {uncategorizedFields.map((general) => (
                            <div key={general.correlative} className="col-md-6 mb-2">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`field-${general.correlative}`}
                                  checked={fieldVisibility[general.correlative] || false}
                                  onChange={() => handleToggleFieldVisibility(general.correlative)}
                                />
                                <label className="form-check-label" htmlFor={`field-${general.correlative}`}>
                                  <strong>{general.name}</strong>
                                
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowVisibilityModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveVisibility}
                    disabled={savingVisibility}
                  >
                    {savingVisibility ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </button>
                </div>
              </div>
            </div>



          </div>
        )}
      {/* Backdrop del modal */}
      {showVisibilityModal && (
        <div className="modal-backdrop fade show"></div>
      )}

      {/* Modal para Agregar/Editar Cintillo */}
      {showCintilloModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-bullhorn me-2"></i>
                  {editingCintillo !== null ? 'Editar Cintillo' : 'Nuevo Cintillo'}
                </h5>
                <button type="button" className="btn-close" onClick={closeCintilloModal}></button>
              </div>
              <div className="modal-body">
                {/* Texto del Cintillo */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="fas fa-edit me-2"></i>Texto del Cintillo
                  </label>
                  <textarea
                    className="form-control"
                    value={modalCintillo.text}
                    onChange={(e) => setModalCintillo({ ...modalCintillo, text: e.target.value })}
                    rows="3"
                    placeholder="Ingresa el texto del cintillo"
                  />
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Evita usar comas en el texto para mejor compatibilidad
                  </small>
                </div>

                {/* Estado Activo */}
                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="modalCintilloEnabled"
                      checked={modalCintillo.enabled}
                      onChange={(e) => setModalCintillo({ ...modalCintillo, enabled: e.target.checked })}
                    />
                    <label className="form-check-label fw-bold" htmlFor="modalCintilloEnabled">
                      Cintillo Activo
                    </label>
                  </div>
                </div>

                {/* Configuraciones Rápidas */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="fas fa-magic me-2"></i>Configuraciones Rápidas
                  </label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => {
                        setModalCintillo({
                          ...modalCintillo,
                          schedule: {
                            monday: { enabled: true, start: '00:00', end: '23:59' },
                            tuesday: { enabled: true, start: '00:00', end: '23:59' },
                            wednesday: { enabled: true, start: '00:00', end: '23:59' },
                            thursday: { enabled: true, start: '00:00', end: '23:59' },
                            friday: { enabled: true, start: '00:00', end: '23:59' },
                            saturday: { enabled: false, start: '00:00', end: '23:59' },
                            sunday: { enabled: false, start: '00:00', end: '23:59' }
                          }
                        });
                      }}
                    >
                      <i className="fas fa-briefcase me-1"></i>Días Laborales
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-info"
                      onClick={() => {
                        setModalCintillo({
                          ...modalCintillo,
                          schedule: {
                            monday: { enabled: false, start: '00:00', end: '23:59' },
                            tuesday: { enabled: false, start: '00:00', end: '23:59' },
                            wednesday: { enabled: false, start: '00:00', end: '23:59' },
                            thursday: { enabled: false, start: '00:00', end: '23:59' },
                            friday: { enabled: false, start: '00:00', end: '23:59' },
                            saturday: { enabled: true, start: '00:00', end: '23:59' },
                            sunday: { enabled: true, start: '00:00', end: '23:59' }
                          }
                        });
                      }}
                    >
                      <i className="fas fa-calendar-weekend me-1"></i>Fines de Semana
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setModalCintillo({
                          ...modalCintillo,
                          schedule: {
                            monday: { enabled: true, start: '00:00', end: '23:59' },
                            tuesday: { enabled: true, start: '00:00', end: '23:59' },
                            wednesday: { enabled: true, start: '00:00', end: '23:59' },
                            thursday: { enabled: true, start: '00:00', end: '23:59' },
                            friday: { enabled: true, start: '00:00', end: '23:59' },
                            saturday: { enabled: true, start: '00:00', end: '23:59' },
                            sunday: { enabled: true, start: '00:00', end: '23:59' }
                          }
                        });
                      }}
                    >
                      <i className="fas fa-globe me-1"></i>Todos los Días
                    </button>
                  </div>
                </div>

                {/* Programación Detallada */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="fas fa-calendar-alt me-2"></i>Programación Detallada
                  </label>
                  <div className="border rounded p-3" style={{ backgroundColor: '#f8f9fa' }}>
                    {[
                      { key: 'monday', label: 'Lunes', icon: 'fas fa-moon' },
                      { key: 'tuesday', label: 'Martes', icon: 'fas fa-sun' },
                      { key: 'wednesday', label: 'Miércoles', icon: 'fas fa-cloud' },
                      { key: 'thursday', label: 'Jueves', icon: 'fas fa-star' },
                      { key: 'friday', label: 'Viernes', icon: 'fas fa-heart' },
                      { key: 'saturday', label: 'Sábado', icon: 'fas fa-home' },
                      { key: 'sunday', label: 'Domingo', icon: 'fas fa-church' }
                    ].map((day) => {
                      const daySchedule = modalCintillo.schedule[day.key] || { enabled: true, start: '00:00', end: '23:59' };
                      
                      return (
                        <div key={day.key} className="row mb-3 align-items-center p-2 rounded" style={{ backgroundColor: daySchedule.enabled ? '#DCFCE7' : '#f8f8f8' }}>
                          <div className="col-md-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`modal-${day.key}`}
                                checked={daySchedule.enabled}
                                onChange={(e) => {
                                  setModalCintillo({
                                    ...modalCintillo,
                                    schedule: {
                                      ...modalCintillo.schedule,
                                      [day.key]: {
                                        ...daySchedule,
                                        enabled: e.target.checked
                                      }
                                    }
                                  });
                                }}
                              />
                              <label className="form-check-label fw-bold d-flex align-items-center" htmlFor={`modal-${day.key}`}>
                                {day.label}
                              </label>
                            </div>
                          </div>
                          {daySchedule.enabled && (
                            <>
                              <div className="col-md-4">
                                <div className="input-group">
                                  <span className="input-group-text">
                                    <i className="fas fa-clock text-success"></i>
                                  </span>
                                  <input
                                    type="time"
                                    className="form-control"
                                    value={daySchedule.start || '00:00'}
                                    onChange={(e) => {
                                      setModalCintillo({
                                        ...modalCintillo,
                                        schedule: {
                                          ...modalCintillo.schedule,
                                          [day.key]: {
                                            ...daySchedule,
                                            start: e.target.value
                                          }
                                        }
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="input-group">
                                  <span className="input-group-text">
                                    <i className="fas fa-clock text-danger"></i>
                                  </span>
                                  <input
                                    type="time"
                                    className="form-control"
                                    value={daySchedule.end || '23:59'}
                                    onChange={(e) => {
                                      setModalCintillo({
                                        ...modalCintillo,
                                        schedule: {
                                          ...modalCintillo.schedule,
                                          [day.key]: {
                                            ...daySchedule,
                                            end: e.target.value
                                          }
                                        }
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-1">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                    setModalCintillo({
                                      ...modalCintillo,
                                      schedule: {
                                        ...modalCintillo.schedule,
                                        [day.key]: {
                                          enabled: true,
                                          start: '00:00',
                                          end: '23:59'
                                        }
                                      }
                                    });
                                  }}
                                  title="Todo el día"
                                >
                                  24h
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCintilloModal}>
                  <i className="fas fa-times me-1"></i>Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={saveCintillo}>
                  <i className="fas fa-save me-1"></i>
                  {editingCintillo !== null ? 'Actualizar' : 'Guardar'} Cintillo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Datos Generales">
      <Generals {...properties} />
    </BaseAdminto>
  );
});
